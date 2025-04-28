const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define("user", {
    // nome della tabella che creo su DB
    name: {
      type: DataTypes.STRING,
      allowNull: false, // indica se il campo è obbligatorio Ad esempio, un campo "username"
    },
    surname: {
      type: DataTypes.STRING,
      allowNull: false, // indica se il campo è obbligatorio Ad esempio, un campo "username"
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    role: {
      type: DataTypes.ENUM("admin", "developer", "viewer"),
      defaultValue: "viewer",
    },
  });
};
