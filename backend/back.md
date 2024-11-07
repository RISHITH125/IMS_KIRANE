# 03.10.2024
- Work on DBMS and connecting that with the frontend 
- create the tables for all the entities


q. should i also write the queries for joining the tables, displaying specific data that can be requested by the user?  
yes
q. will the backend be like executing sql queries to fetch data items that is requested by the user? will there be backend in node js which will execute the sql queries?  
yes

- notify the user when the psrticular stock is empty and also tell him about the supplier of ythat stock
- recommending the products for particular categories of market to boost sales

### Login Features
- Firstly ask the user whether he wants to login or signup
- Login means ask username, password, storename and check if this is existing in the database. If exists, proceed with the further operations.
- Sign up means, idk

### Features
- We can implement a lazy analysis tool which starts to gather data and analyse only when the user wants to get insights.
- Instead of overloading the app initially, let the user themselves click on that specific button and get the analysis done.


### New Features
- The user mustn't specify for the categoryID or productID. The application must handle it at the backend i.e.
    it must search for the specified category/supplier in the table. If it exists, it returns the id of that and stores it in the product page.
- Updating the product quantity anonymously
- supplier page nalli, avn supply maadiro products na category wise display maadbeeku aamele, user ge place order antha option irutte. user, adrmeele click maadidaga purchaseOrder table update aagutte with orderStatus as 0.
- supplier page nalli, he shud be able to add new suppliers. after this, this new supplier will be reflected in the products page only then will he be able to add a new product.
- supplier page nalli, he shud be able to add new products. integrate that with existing functionalities to add products. 
- Login page maadu
- create a job to check quantity for all products at regular intervals to check if it falls below reorderLevel
- create a job to check the expiry of products
- 




#### // needs to be discussed 
#### // need to be coded