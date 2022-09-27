// console.log(module);
// module.exports is used to export the module
//module.exports = "Hello world"; // the text will be console.loged ...
// module.export is an object and it can have properties
module.exports.getdate = function () {
  let today = new Date(); // function to find dates and days in js
  let options = {
    weekday: "long",
    day: "numeric",
    month: "long",
  };
  let day = today.toLocaleDateString("en-US", options);
  return day;
};
module.exports.getDay =function() {
  let today = new Date();
  let options = {
    weekday: "long",
  };
  let day = today.toLocaleDateString("en-US", options);
  return day;
}
