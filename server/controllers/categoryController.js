const Category = require('../models/Category');
const Product = require('../models/Product');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
exports.getCategories = async (req, res, next) => {
  try {
    const { includeInactive = false } = req.query;
    
    let query = {};
    if (!includeInactive) {
      query.status = 'active';
    }

    const categories = await Category.find(query)
      .populate('subcategories')
      .populate('productCount')
      .sort({ sortOrder: 1, name: 1 });

    res.status(200).json({
      success: true,
      data: categories
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single category
// @route   GET /api/categories/:slug
// @access  Public
exports.getCategory = async (req, res, next) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug })
      .populate('subcategories')
      .populate('productCount');

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.status(200).json({
      success: true,
      data: category
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get category products
// @route   GET /api/categories/:slug/products
// @access  Public
exports.getCategoryProducts = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const {
      page = 1,
      limit = 20,
      sortBy = 'newest',
      brand,
      priceMin,
      priceMax,
      inStock
    } = req.query;

    // Build product query
    let productQuery = { 
      category: slug,
      status: 'active'
    };

    if (brand) {
      const brands = brand.split(',');
      productQuery.brand = { $in: brands };
    }

    if (priceMin || priceMax) {
      productQuery.price = {};
      if (priceMin) productQuery.price.$gte = parseFloat(priceMin);
      if (priceMax) productQuery.price.$lte = parseFloat(priceMax);
    }

    if (inStock === 'true') {
      productQuery['inventory.inStock'] = true;
    }

    // Build sort
    let sort = {};
    switch (sortBy) {
      case 'price-low':
        sort.price = 1;
        break;
      case 'price-high':
        sort.price = -1;
        break;
      case 'rating':
        sort['rating.average'] = -1;
        break;
      case 'name':
        sort.name = 1;
        break;
      case 'newest':
      default:
        sort.createdAt = -1;
    }

    const products = await Product.find(productQuery)
      .sort(sort)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .select('name price originalPrice images category brand rating inventory.inStock isNew isFeatured');

    const total = await Product.countDocuments(productQuery);

    // Get available brands for filtering
    const availableBrands = await Product.distinct('brand', { 
      category: slug, 
      status: 'active' 
    });

    res.status(200).json({
      success: true,
      data: {
        products,
        filters: {
          availableBrands: availableBrands.sort()
        },
        pagination: {
          current: parseInt(page),
          total: Math.ceil(total / parseInt(limit)),
          count: products.length,
          totalProducts: total
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Admin endpoints

// @desc    Create category (Admin)
// @route   POST /api/categories
// @access  Private/Admin
exports.createCategory = async (req, res, next) => {
  try {
    const category = await Category.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update category (Admin)
// @route   PUT /api/categories/:id
// @access  Private/Admin
exports.updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      data: category
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete category (Admin)
// @route   DELETE /api/categories/:id
// @access  Private/Admin
exports.deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Check if category has products
    const productCount = await Product.countDocuments({ 
      category: category.slug,
      status: 'active'
    });

    if (productCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category. ${productCount} products are using this category.`
      });
    }

    // Check if category has subcategories
    const subcategoryCount = await Category.countDocuments({ 
      parent: category._id 
    });

    if (subcategoryCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category. It has ${subcategoryCount} subcategories.`
      });
    }

    await category.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};