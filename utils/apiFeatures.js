// ─── ApiFeatures — reusable filter/sort/pagination utility ───────────────────
// Usage:
//   const features = new ApiFeatures(Property.find(), req.query)
//     .filter()
//     .keyword()
//     .sort()
//     .paginate();
//   const properties = await features.query;

export class ApiFeatures {
  constructor(query, queryString) {
    this.query = query;           // Mongoose query object
    this.queryString = queryString; // req.query
  }

  // ── Keyword search (title, city, address, description) ──
  keyword() {
    if (this.queryString.keyword) {
      const regex = { $regex: this.queryString.keyword, $options: "i" };
      this.query = this.query.find({
        $or: [
          { title: regex },
          { city: regex },
          { address: regex },
          { description: regex },
        ],
      });
    }
    return this;
  }

  // ── Filters ──
  filter() {
    const queryObj = { ...this.queryString };

    // Remove non-filter fields
    const excludedFields = ["keyword", "sort", "page", "limit"];
    excludedFields.forEach((f) => delete queryObj[f]);

    // Build filter object
    const filter = {};

    if (queryObj.city) filter.city = { $regex: queryObj.city, $options: "i" };
    if (queryObj.country) filter.country = { $regex: queryObj.country, $options: "i" };
    if (queryObj.listingType) filter.listingType = queryObj.listingType;
    if (queryObj.propertyType) filter.propertyType = queryObj.propertyType;
    if (queryObj.status) filter.status = queryObj.status;
    if (queryObj.bedrooms) filter.bedrooms = Number(queryObj.bedrooms);
    if (queryObj.bathrooms) filter.bathrooms = Number(queryObj.bathrooms);

    // Price range
    if (queryObj.minPrice || queryObj.maxPrice) {
      filter.price = {};
      if (queryObj.minPrice) filter.price.$gte = Number(queryObj.minPrice);
      if (queryObj.maxPrice) filter.price.$lte = Number(queryObj.maxPrice);
    }

    // Area range
    if (queryObj.minArea || queryObj.maxArea) {
      filter.area = {};
      if (queryObj.minArea) filter.area.$gte = Number(queryObj.minArea);
      if (queryObj.maxArea) filter.area.$lte = Number(queryObj.maxArea);
    }

    this.query = this.query.find(filter);
    return this;
  }

  // ── Sort ──
  sort() {
    const sortMap = {
      price_asc:   { price: 1 },
      price_desc:  { price: -1 },
      most_viewed: { views: -1 },
      oldest:      { createdAt: 1 },
      newest:      { createdAt: -1 },
    };

    const sortOption = sortMap[this.queryString.sort] || { createdAt: -1 };
    this.query = this.query.sort(sortOption);
    return this;
  }

  // ── Pagination ──
  paginate() {
    const page = Number(this.queryString.page) || 1;
    const limit = Number(this.queryString.limit) || 10;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    this.page = page;
    this.limit = limit;
    return this;
  }
}
