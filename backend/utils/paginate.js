const paginate = async (model, query = {}, options = {}) => {
  const page = Math.max(1, parseInt(options.page || 1, 10));
  const limit = Math.max(1, Math.min(100, parseInt(options.limit || 10, 10)));
  const sort = options.sort || '-createdAt';

  const [items, total] = await Promise.all([
    model.find(query).sort(sort).skip((page - 1) * limit).limit(limit),
    model.countDocuments(query)
  ]);

  return {
    items,
    page,
    limit,
    total,
    pages: Math.ceil(total / limit)
  };
};

module.exports = paginate;
