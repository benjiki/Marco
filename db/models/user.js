"use strict";
const { Model, Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../../config/database");
const bcrypt = require("bcrypt");
const AppError = require("../../utils/appError");
const project = require("./project");

const user = sequelize.define(
  "user",
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    userType: {
      type: Sequelize.ENUM("0", "1", "2"),
      allowNull: false,
      validate: {
        notNull: {
          msg: "User type is required and can not be null",
        },
        notEmpty: {
          msg: "User type is required and can not be empty",
        },
      },
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "User First Name is required",
        },
        notEmpty: {
          msg: "User First Name is required and can not be empty",
        },
      },
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "User Last Name is required ",
        },
        notEmpty: {
          msg: "User Last Name is required and can not be empty",
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notNull: {
          msg: "User Email is required ",
        },
        notEmpty: {
          msg: "User Email can not be empty",
        },
        isEmail: {
          msg: "Email has to end with @gmail.com",
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "User Password is required ",
        },
        notEmpty: {
          msg: "User Password is required and can not be empty",
        },
      },
    },
    ConfirmPassword: {
      type: DataTypes.VIRTUAL,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Confirm Password is required and can not be null",
        },
        notEmpty: {
          msg: "Confirm Password is required and can not be empty",
        },
      },
      set(value) {
        if (this.password.length < 7) {
          throw new AppError(
            "Password must be at least 7 characters long",
            400
          );
        }
        if (value === this.password) {
          const hash = bcrypt.hashSync(value, 10);
          this.setDataValue("password", hash);
        } else {
          throw new AppError("Passwords do not match", 400);
        }
        this.setDataValue("ConfirmPassword", value);
      },
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: Sequelize.NOW,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: Sequelize.NOW,
    },
    deletedAt: {
      type: DataTypes.DATE,
    },
  },
  {
    paranoid: true,
    freezeTableName: true,
    modelName: "user",
  }
);
user.hasMany(project, { foreignKey: "createdBy" });
project.belongsTo(user, {
  foreignKey: "createdBy",
});

module.exports = user;
