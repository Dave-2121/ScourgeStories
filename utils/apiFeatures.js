class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }
  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = [
      'page',
      'sort',
      'limit',
      'fields',
      'regex',
      'created_at_gteq',
      'created_at_lteq',
    ];

    excludedFields.forEach((ele) => delete queryObj[ele]);

    let queryStr = JSON.stringify(queryObj);

    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    const filterObj = JSON.parse(queryStr);

    if (this.queryString.regex) {
      filterObj.title = { $regex: this.queryString.regex, $options: 'i' };
    }

    if (this.queryString.created_at_gteq) {
      const startDate = new Date(this.queryString.created_at_gteq);
      const endDate = new Date(this.queryString.created_at_lteq);

      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);

      filterObj.createdAt = {
        $gte: startDate,
        $lte: endDate,
      };
    }

    this.query = this.query.find(filterObj);

    return this;
  }
  paginate() {
    const page = +this.queryString.page || 1;
    const limit = +this.queryString.limit || 10;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;
