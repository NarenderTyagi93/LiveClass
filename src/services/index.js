const request = require("request");

module.exports = class Services {
  static getBusinessList = async (limit, offset, location, category) => {
    /**
     * Find the business list with limit and offset further we can add search also
     *
     */
    const options = {
      method: "GET",
      url: `https://api.yelp.com/v3/businesses/search?latitude=37.4848&longitude=122.2281&sort_by=rating&limit=${limit}&$offset=${offset}&location=${location}&categories=${category}`,
      headers: {
        Authorization: `Bearer ${config.YELP_API_KEY}`,
      },
    };

    try {
      const { businesses = [] } = await this.fetchUsingRequest(options);
      if (!businesses || !businesses.length) {
        return {
          success: false,
          data: {},
          status: { code: 400, info: "No Business Found" },
        };
      }
      return {
        success: true,
        data: { list: businesses },
        status: { code: 200, info: "Business Fetched Succesfully" },
      };
    } catch (error) {
      return {
        success: false,
        data: {},
        status: { code: 400, info: error.message },
      };
    }
  };

  static getReviewData = async (id) => {
    /**
     * Find the business review data by business id
     *
     */
    if (!id) {
      return {
        success: false,
        data: {},
        status: { code: 400, info: "Business Id is Required" },
      };
    }
    const business = await Services.getBusinessData(id);
    if (!business) {
      return {
        success: false,
        data: {},
        status: { code: 400, info: `No Business Found For Id ${id}` },
      };
    }
    var options = {
      method: "GET",
      url: `https://api.yelp.com/v3/businesses/${id}/reviews`,
      headers: {
        Authorization: `Bearer ${config.YELP_API_KEY}`,
      },
    };

    try {
      const { reviews = [] } = await this.fetchUsingRequest(options);
      if (!reviews || !reviews.length) {
        return {
          success: false,
          data: {},
          status: { code: 400, info: "No Business Reviews Found" },
        };
      }
      return {
        success: true,
        data: {
          review_user_names: reviews.map((r) => r.user.name),
          ...business,
        },
        status: { code: 200, info: "Business Fetched Succesfully" },
      };
    } catch (error) {
      return {
        success: false,
        data: {},
        status: { code: 400, info: error.message },
      };
    }
  };

  static getBusinessData = async (id) => {
    var options = {
      method: "GET",
      url: `https://api.yelp.com/v3/businesses/${id}`,
      headers: {
        Authorization: `Bearer ${config.YELP_API_KEY}`,
      },
    };
    try {
      const { name: business_name, location } = await this.fetchUsingRequest(
        options
      );
      return {
        business_name,
        city: location.city,
        state: location.state,
      };
    } catch (error) {
      return false;
    }
  };

  static fetchUsingRequest = async (options) => {
    return new Promise((res, rej) => {
      request(options, function (error, response) {
        if (error) rej(error);
        res(JSON.parse(response.body));
      });
    });
  };
};
