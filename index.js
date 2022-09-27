const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js"); // runs all the code in date.js
const app = express();
const _ = require("lodash")
const mongoose = require("mongoose");
const tempPort = 3000;
// var newElement = "";  creating to define an empty newElement variable to be used. but using this will only add the latest element in the latest post action and hence we will be using an array.
// var newElementarray = ["Buy food", "Cook food", "Eat food"];
// set apps view engine to ejs
app.set("view engine", "ejs"); // this is really important for the code to work
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
mongoose.connect("mongodb+srv://Admin_Rahul:test123@cluster0.16bu1op.mongodb.net/todolistDB");
const itemsSchema = {
  name: { type: String },
};
const Item = mongoose.model("Item", itemsSchema);
// let workitems = [];
let listTitle;

const item1 = new Item({
  name: "Web Dev",
});
const item2 = new Item({
  name: "Eat lunch",
});
const item3 = new Item({
  name: "Git the + button to add a new item.",
});
const item4 = new Item({
  name: "<-- Hit this to delete an item.",
});
const defaultItems = [item1, item2, item3, item4];
const listSchema = {
  name : String, 
  items : [itemsSchema]
}
const List = mongoose.model("List", listSchema);
app.get("/", (req, res) => {
  Item.find({}, function (err, foundItems) {
    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log("Array of items added successfully.");
        }
      });
      res.redirect("/"); // it will check if there are any items on the item collection and if there are none then it will add the items and then redirect it into the home route and then go into the else block
    } else {
      res.render("list", {
        listTitle: "Today",
        newElementarray: foundItems,
      });
    }
  });
  let day = date.getdate();
  // renders from the view engine. create a folder called views where the view engine will search for the template and then create the files(ejs files) the engine needs to look for into this folder.
  // <%=day%> --> marker that tells the engine to replace the variable with the data
});
//  creating parameter custom list routes
app.get("/:customListName", function(req,res){
  const customListName=_.capitalize(req.params.customListName);
  List.findOne({name : customListName}, function(err, foundList){
    if(!err){
      if(!foundList){
        //console.log("Doesnt exist");
        // creating a new list
        const list = new List({
          name: customListName, 
          items: defaultItems
        })
        list.save();
        res.redirect("/" + customListName)
      }
      else{
        //console.log("Exists")
        // show an existing list
        res.render("list", {listTitle: foundList.name , newElementarray: foundList.items} )
      }
    }
  })
  
})
app.post("/", (req, res) => {
  const itemName = req.body.newItem;
  const listName = req.body.list;
  const itemN = new Item({
    name: itemName,
  });
  if(listName === "Today"){
    itemN.save();
    res.redirect("/");

  }else{
    List.findOne({name: listName}, function(err, foundList){
      foundList.items.push(itemN);
      foundList.save();
      res.redirect("/"+listName);
    })
  }
  
  // console.log(newElement);
});
app.post("/delete", function (req, res) {
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;

  if(listName === "Today"){
    Item.findByIdAndRemove(checkedItemId, function(err){
      if(!err){
        console.log("Successfully deleted checked item.");
        res.redirect("/")
      }
    })
  }
  else{
    List.findOneAndUpdate({name : listName}, {$pull: {items : {_id: checkedItemId}}}, function(err, foundList){
      if(err){
        console.log(err)
      }
      else{
        console.log("Item deleted from a page which is not the home route.")
        res.redirect("/" + listName);
      }
    })
  }

 
});



// app.post("/work", (req,res)=>{
//   let item = req.body.newItem;
//   workitems.push(item);
//   res.redirect("/work");
// }); the form method is posting to the home route ... so write an if conditional in the home route saying that if the value of the button is work then we have to use this post request
app.listen(tempPort, () => {
  console.log("Being hosted at http://localhost:" + tempPort);
});

/* 
  we talk to people on a daily basis and we wish them and do promises with each other. we can also get feedback.
  knowing people through this.
  giving respect to other people 
    enter phone no. of person and then you can give respect.
  wishing luck on events 
   we can check years later that how some people wished us birthdays or something 
  give promises for the assurance
    promises can be made between 2 people and they can have mutual agreement. dosti break na ho udhari me.
  give review based on your exp.
    giving feedback to people around us. 

  discover people around you and then appreciate them

  schedule feature 
  colour theory
  content writing 

*/
