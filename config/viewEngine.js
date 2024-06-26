import express from "express";
import path from "path";

let configViewEngine = (app) => {
    app.use(express.static(path.join(__dirname, '../../public'))); // Adjust the path to static files
    app.set("view engine", "ejs");
    app.set("views", path.join(__dirname, '../views')); // Ensure the correct path to the views directory
};

module.exports = configViewEngine;
