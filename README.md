# The Coll Project
## Description

### Front-end
- Written on js with AngularJS 1.5.8 
- Uses **bower** package manager for _vendor_ libraries like AngularJS, etc. 
- Don't uses such good thing as webpack (so, you got to add new `script` or `style` files manually in `app/index.html` such a shame :( ) 

### Back-end (api folder)
- Written on native PHP (5.63) 
- Uses *POD* And *postgreSQL* (version 9.2.x) and all it on Apache (that's important!)
- Routing system between back and front is build on `.htaccess` relations 
- No migrations systems is enabled. 

AngularJS and some other modules installing via 

### How to initialize environment

0. Install [LAMP](http://help.ubuntu.ru/wiki/apachemysqlphp), but instead of *MySql* you should install *PostgreSQL*
2. Enable .htaccess in Apache HTTP server
1. Do the git clone in your folder which *Apache* can see (by default it's `/var/www/html`)
2. Install bower, Do the bower update 
4. Configure PostgreSQL 
5. Create new db user for PostgreSQL (if it's necessary) and database `coll`
6. Migrate dump (you can get it from *production*)

that's it!

_in case of any exeptions and errors_
 1. look at the apache's error logs
 2. look at the dev's browser's console (i prefer chrome)
 3. look at the versions of software packages. Like i said before, it's *important*!