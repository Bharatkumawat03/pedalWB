const Product = require('../models/Product');
const Review = require('../models/Review');

// @desc    Get all products with filters
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res, next) => {
  try {
    const {
      category,
      brand,
      priceMin,
      priceMax,
      inStock,
      isNew,
      isFeatured,
      search,
      sortBy,
      page = 1,
      limit = 20
    } = req.query;

    // Parse brand filter
    const brandFilter = brand ? brand.split(',') : [];

    // Build filter object
    const filters = {
      category: category !== 'all' ? category : undefined,
      brand: brandFilter.length > 0 ? brandFilter : undefined,
      priceMin: priceMin ? parseFloat(priceMin) : undefined,
      priceMax: priceMax ? parseFloat(priceMax) : undefined,
      inStock: inStock ? inStock === 'true' : undefined,
      isNew: isNew ? isNew === 'true' : undefined,
      isFeatured: isFeatured ? isFeatured === 'true' : undefined,
      search,
      sortBy: sortBy || 'newest',
      page: parseInt(page),
      limit: Math.min(parseInt(limit), 100) // Max 100 items per page
    };

    // Remove undefined values
    Object.keys(filters).forEach(key => 
      filters[key] === undefined && delete filters[key]
    );

    const products = await Product.getFilteredProducts(filters);

    // Get total count for pagination
    let countQuery = { status: 'active' };
    if (filters.category) countQuery.category = filters.category;
    if (filters.brand) countQuery.brand = { $in: filters.brand };
    if (filters.priceMin !== undefined || filters.priceMax !== undefined) {
      countQuery.price = {};
      if (filters.priceMin !== undefined) countQuery.price.$gte = filters.priceMin;
      if (filters.priceMax !== undefined) countQuery.price.$lte = filters.priceMax;
    }
    if (filters.inStock !== undefined) countQuery['inventory.inStock'] = filters.inStock;
    if (filters.isNew !== undefined) countQuery.isNew = filters.isNew;
    if (filters.isFeatured !== undefined) countQuery.isFeatured = filters.isFeatured;
    if (filters.search) {
      countQuery.$text = { $search: filters.search };
    }

    const total = await Product.countDocuments(countQuery);
    const totalPages = Math.ceil(total / filters.limit);

    res.status(200).json({
      success: true,
      data: products,
      pagination: {
        current: filters.page,
        total: totalPages,
        count: products.length,
        totalProducts: total
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate({
        path: 'reviews',
        populate: {
          path: 'user',
          select: 'firstName lastName avatar'
        },
        match: { status: 'approved' },
        options: { sort: { createdAt: -1 } }
      });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Get related products (same category, different product)
    const relatedProducts = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
      status: 'active'
    })
    .limit(4)
    .select('name price originalPrice images category brand rating');

    res.status(200).json({
      success: true,
      data: {
        product,
        relatedProducts
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
exports.getFeaturedProducts = async (req, res, next) => {
  try {
    const products = await Product.find({
      isFeatured: true,
      status: 'active',
      'inventory.inStock': true
    })
    .limit(parseInt(req.query.limit) || 8)
    .select('name price originalPrice images category brand rating isNew')
    .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get new products
// @route   GET /api/products/new
// @access  Public
exports.getNewProducts = async (req, res, next) => {
  try {
    const products = await Product.find({
      isNew: true,
      status: 'active',
      'inventory.inStock': true
    })
    .limit(parseInt(req.query.limit) || 8)
    .select('name price originalPrice images category brand rating')
    .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Search products
// @route   GET /api/products/search
// @access  Public
exports.searchProducts = async (req, res, next) => {
  try {
    const { q, limit = 10 } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const products = await Product.find(
      { 
        $text: { $search: q },
        status: 'active'
      },
      { score: { $meta: 'textScore' } }
    )
    .sort({ score: { $meta: 'textScore' } })
    .limit(parseInt(limit))
    .select('name price images category brand rating');

    res.status(200).json({
      success: true,
      data: products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get product reviews
// @route   GET /api/products/:id/reviews
// @access  Public
exports.getProductReviews = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, sort = 'newest' } = req.query;
    
    let sortOption = { createdAt: -1 };
    switch (sort) {
      case 'oldest':
        sortOption = { createdAt: 1 };
        break;
      case 'highest':
        sortOption = { rating: -1, createdAt: -1 };
        break;
      case 'lowest':
        sortOption = { rating: 1, createdAt: -1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }

    const reviews = await Review.find({
      product: req.params.id,
      status: 'approved'
    })
    .populate('user', 'firstName lastName avatar')
    .sort(sortOption)
    .limit(parseInt(limit))
    .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Review.countDocuments({
      product: req.params.id,
      status: 'approved'
    });

    res.status(200).json({
      success: true,
      data: reviews,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / parseInt(limit)),
        count: reviews.length
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add product review
// @route   POST /api/products/:id/reviews
// @access  Private
exports.addProductReview = async (req, res, next) => {
  try {
    const { rating, title, comment } = req.body;
    const productId = req.params.id;
    const userId = req.user._id;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if user has already reviewed this product
    const existingReview = await Review.findOne({
      product: productId,
      user: userId
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this product'
      });
    }

    // Create review
    const review = await Review.create({
      product: productId,
      user: userId,
      rating,
      title,
      comment
    });

    await review.populate('user', 'firstName lastName avatar');

    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      data: review
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create product (Admin)
// @route   POST /api/products
// @access  Private/Admin
exports.createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product (Admin)
// @route   PUT /api/products/:id
// @access  Private/Admin
exports.updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product (Admin)
// @route   DELETE /api/products/:id
// @access  Private/Admin
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Soft delete - change status to inactive
    product.status = 'inactive';
    await product.save();

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};