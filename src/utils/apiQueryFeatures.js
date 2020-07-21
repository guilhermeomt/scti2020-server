class APIQueryFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['sort', 'limit', 'page', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort(defaultSort = '-createdAt') {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query.sort(sortBy);
    } else {
      this.query.sort(`${defaultSort}`);
    }

    return this;
  }

  fields(notAllowedFields = []) {
    if (this.queryString.fields) {
      let fields = this.queryString.fields.split(',').join(' ');

      notAllowedFields.forEach((el) => {
        if (fields.includes(el)) {
          fields = fields.replace(el, '');
        }
      });

      this.query.select(fields);
    } else {
      this.query.select('-__v');
    }

    return this;
  }

  paginate() {
    const pages = +this.queryString.page || 1;
    const limit = +this.queryString.limit || 50;

    this.query.skip((pages - 1) * limit).limit(limit);

    return this;
  }
}

module.exports = APIQueryFeatures;
