import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

// export const sequelize: Sequelize = new Sequelize(
//     process.env.AWS_RDS_DB,
//     process.env.AWS_RDS_USERNAME,
//     process.env.AWS_RDS_PASSWORD,
//     {
//         host: process.env.AWS_RDS_URL,
//         dialect: "postgres",
//         define: {
//             //prevent sequelize from pluralizing table names
//             freezeTableName: true,
//         },
//     }
// );

// export const setup = async () => {
//     try {
//         await sequelize.authenticate();
//         console.log("Connection has been established successfully.");
//     } catch (error) {
//         console.error("Unable to connect to the database:", error);
//     }
// };

export const sequelize: Sequelize = new Sequelize(
    JSON.parse(process.env.AWS_RDS_SECRETS).AWS_RDS_DB,
    JSON.parse(process.env.AWS_RDS_SECRETS).AWS_RDS_USERNAME,
    JSON.parse(process.env.AWS_RDS_SECRETS).AWS_RDS_PASSWORD,
    {
        host: process.env.AWS_RDS_URL,
        dialect: "postgres",
        define: {
            //prevent sequelize from pluralizing table names
            freezeTableName: true,
        },
        dialectOptions: {
            // for reading
            useUTC: false,
            timezone: "Asia/Singapore",
        },
        timezone: "Asia/Singapore", // for writing
    }
);

(async () => {
    try {
        await sequelize.authenticate();
        console.log("Connection has been established successfully.");
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    }
})();
