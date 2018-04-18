use sakila;
#1a. Display the first and last names of all actors from the table actor. 
select first_name,last_name from actor;

#1b. Display the first and last name of each actor in a single column in upper case letters. Name the column Actor Name. 
select concat(first_name," ",last_name) from actor;

#2a. You need to find the ID number, first name, and last name of an actor, of whom you know only the first name, "
#Joe." What is one query would you use to obtain this information?
select actor_id ,first_name , last_name 
from actor 
where first_name in ('Joe');

#2b. Find all actors whose last name contain the letters GEN:
select * FROM actor WHERE last_name LIKE '%GEN%';

#2c. Find all actors whose last names contain the letters LI. This time, order the rows by last name and first name, in that order:
select * FROM actor WHERE last_name LIKE '%LI%'
ORDER BY last_name ;
#2d. Using IN, display the country_id and country columns of the following countries: Afghanistan, Bangladesh, and China:

#3a. Add a middle_name column to the table actor. Position it between first_name and last_name. Hint: you will need to specify the data type.
ALTER TABLE actor
ADD middle_name varchar (30);

#3b. You realize that some of these actors have tremendously long last names. Change the data type of the middle_name column to blobs.
ALTER TABLE actor
MODIFY COLUMN middle_name blob (30);

#3c. Now delete the middle_name column.
ALTER TABLE  actor
DROP middle_name;

#4a. List the last names of actors, as well as how many actors have that last name.
 SELECT last_name , count(*) 
 FROM actor
 GROUP BY last_name;
 
#4b. List last names of actors and the number of actors who have that last name, but only for names that are shared by at least two actors
 SELECT last_name , count(*) 
 FROM actor
 GROUP BY last_name 
 Having
COUNT(*) > 2;

#4c. Oh, no! The actor HARPO WILLIAMS was accidentally entered in the actor table as 
#GROUCHO WILLIAMS, the name of Harpo's second cousin's husband's yoga teacher. Write a query to fix the record.
UPDATE actor
SET first_name = 'HARPO'
WHERE first_name = 'GROUCHO' and last_name='WILLIAMS' ;



#4d. Perhaps we were too hasty in changing GROUCHO to HARPO.It turns out that GROUCHO was the correct name after all! 
#In a single query, if the first name of the actor is currently HARPO, change it to GROUCHO. 
#Otherwise, change the first name to MUCHO GROUCHO, as that is exactly what the actor will be with the grievous error. 
#BE CAREFUL NOT TO CHANGE THE FIRST NAME OF EVERY ACTOR TO MUCHO GROUCHO, HOWEVER! (Hint: update the record using a unique identifier.)
UPDATE actor
SET first_name = 'GROUCHO'
WHERE first_name = 'HARPO' and last_name='WILLIAMS' ;

#5a. You cannot locate the schema of the address table. Which query would you use to re-create it? **
#Hint: https://dev.mysql.com/doc/refman/5.7/en/show-create-table.html
show create table address;

#6a. Use JOIN to display the first and last names, as well as the address, of each staff member. Use the tables staff and address:
select staff.first_name,staff.last_name, staff.staff_id, address.address, address.address2, address.district
from staff
left join address on staff.address_id = address.address_id;


#6b. Use JOIN to display the total amount rung up by each staff member in August of 2005. Use tables staff and payment. **
select  S.staff_id ,count(P.customer_id) as rungamount
from staff S
left join payment P on S.staff_id = P.staff_id
group by S.staff_id;

#6c. List each film and the number of actors who are listed for that film. Use tables film_actor and film. Use inner join.**
select film.film_id, film.title, count(actor_id) 
from film
inner join film_actor on film.film_id=film_actor.film_id
group by film_id;

#6d. How many copies of the film Hunchback Impossible exist in the inventory system?
select count(I.store_id) 
from film F, inventory I 
where F.title= "Hunchback Impossible" and F.film_id=I.film_id;


#6e. Using the tables payment and customer and the JOIN command, list the total paid by each customer. List the customers alphabetically by last name:
select C.last_name, sum(P.amount)
from customer C
left join payment P on C.customer_id=P.customer_id
group by C.last_name
order by C.last_name ASC;


#    ![Total amount paid](Images/total_payment.png)

#7a. The music of Queen and Kris Kristofferson have seen an unlikely resurgence. As an unintended consequence,
# films starting with the letters K and Q have also soared in popularity. Use subqueries to display the titles of movies starting with the letters K 
#and Q whose language is English. 
select film.title, language.name
from  film
left join language on film.language_id=language.language_id
where film.title like  'Q%'  or  film.title like  'K%' and name='English';

#7b. Use subqueries to display all actors who appear in the film Alone Trip.


select first_name, last_name 
from actor A, film_actor FA
where  A.actor_id=FA.actor_id and FA.film_id=(
select film_id from film 
		where title='Alone Trip');
	
#7#c. You want to run an email marketing campaign in Canada, for which you will need the names and email addresses of all Canadian customers.
# Use joins to retrieve this information.

select C.email, C.first_name,C.last_name
from customer C
left join address A on A.address_id=C.address_id
left join city CI on A.city_id=CI.city_id
left join country CO on CI.country_id=CO.country_id
where CO.country="Canada";


#7d. Sales have been lagging among young families, and you wish to target all family movies for a promotion. Identify all movies categorized as famiy films.
select F.title
from film F, film_category FC, category C
where F.film_id = FC.film_id and 
C.category_id=FC.category_id and
C.name="Family";


#7e. Display the most frequently rented movies in descending order.
select F.title ,count(R.rental_date)
from film F 
left join inventory I on F.film_id=I.film_id
left join rental R on R.inventory_id=I.inventory_id
group by F.title
order by count(R.rental_date) DESC;


#7f. Write a query to display how much business, in dollars, each store brought in.
select S.store_id, sum(P.amount)
from store S 
left join staff ST on S.store_id=ST.store_id
left join payment P on P.staff_id=ST.staff_id
group by S.store_id;


#7g. Write a query to display for each store its store ID, city, and country.
select S.store_id, C.city, CO.country
from store S
left join address A on A.address_id=S.store_id
left join city C on C.city_id=A.city_id
left join country CO on Co.country_id=C.country_id;

#7h. List the top five genres in gross revenue in descending order. (Hint: you may need to use the following tables: 
#category, film_category, inventory, payment, and rental.)
#category - film _category - film - inventory - rental - payment 

select CAT.name, sum(P.amount)
from category CAT
left join film_category CTF on CTF.category_id=CAT.category_id
left join film F on CTF.film_id= F.film_id
left join inventory I on I.film_id= F.film_id
left join rental R on R.inventory_id=I.inventory_id
left join payment P on P.rental_id=R.rental_id
group by CAT.name
order by sum(P.amount) DESC
limit 5 ;


#8a. In your new role as an executive, you would like to have an easy way of viewing the Top five genres by gross revenue. 
#Use the solution from the problem above to create a view. If you haven't solved 7h, you can substitute another query to create a view.
CREATE VIEW Exec AS 
select CAT.name, sum(P.amount)
from category CAT
left join film_category CTF on CTF.category_id=CAT.category_id
left join film F on CTF.film_id= F.film_id
left join inventory I on I.film_id= F.film_id
left join rental R on R.inventory_id=I.inventory_id
left join payment P on P.rental_id=R.rental_id
group by CAT.name
order by sum(P.amount) DESC
limit 5 ;


#8b. How would you display the view that you created in 8a?
select * from Exec;

#8c. You find that you no longer need the view top_five_genres. Write a query to delete it.
Drop View Exec;


#Appendix: List of Tables in the Sakila DB

#A schema is also available as sakila_schema.svg. Open it with a browser to view.