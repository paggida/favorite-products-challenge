export default {
  limitByPage: process.env.LIMIT_BY_PAGE? parseInt(process.env.LIMIT_BY_PAGE)|10 : 10,
  sortField: '-createdAt'
};
