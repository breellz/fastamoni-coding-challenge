module.exports = {
 generateUserData: (requestParams, ctx, ee, next) => {
  const id = Math.floor(Math.random() * 1000000000000);
  ctx.vars.email = `user${id}@test.com`;
  ctx.vars.username = `usersss${id}`;
  ctx.vars.password = "passwordsss";
  return next();
 },
 logResponse: (requestParams, response, context, ee, next) => {
  // console.log("Request Params:", requestParams);
  // console.log("Status Code:", response.statusCode);
  // console.log("Body:", response.body);
  return next();
 },
};
