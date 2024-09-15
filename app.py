from statistics import median, mean
from sqlalchemy import desc, or_
from flask import Flask, render_template, redirect, request, url_for
from models import signup, junkmail, db
from config import Config
from models import db
from models import User
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase
import jsonpickle
from models import BlogPost, db



app = Flask(__name__)
app.config.from_object('config')  

@app.route("/signup", methods=["POST"])
def create_PERSONAL_action():
    PERSONAL = PERSONAL(
        FName=request.form["FISRT NAME"],
        LName=request.form["Surname"],
        Answer=request.form["Answer"], 
        Email=request.form["EMAIL"], 
        gender=request.form["gender"],
        Ireland=request.form["Answer"],
        TandC=request.form["Answered"],
        Date=request.form["Answered"],

    )
    db.signup.add()
    db.signup.commit()
    return redirect(url_for("index"))


with app.app_context():
    db.init_app(app)  
    db.create_all() 

@app.route("/")
@app.route("/signup")
def signup():
    return render_template("signup.html", signup=signup.query.order_by(desc(signup.datetime)).all())
 
    page = request.args.get('page', 1, type=int)
    pagination = signup.query.order_by(desc(Booking.starttime)).paginate(page=page, per_page=999)
    return render_template("signup.html", pagination=pagination)

@app.route("/signup/search", methods=['GET'])
def search_signup():
    query = request.args.get('q')
    signup = signup.query.filter(signup.facility.name.like(f'%{query}%')).all()


@app.route("/circular/search", methods=['GET'])
def search_circular():    
    circulars = db.session.query(circulars).join(circulars).join(circulars).filter()


@app.route("/junkmail/search", methods=['GET'])
def search_circular():    
  or_(junkmail.name.ilike(f'%{query}%') junkmail.Ename.ilike(f'%{query}%')).all()
  return render_template("signup.html", signup=signup, query=junkmail, query=mailshoot) 
page = request.args.get('page', 1, type=int) pagination = db.session.query(signup).join(signup).join(signup).filter(
        or_(mailshoot.name.ilike(f'%{query}%'), signup.firstname.ilike(f'%{query}%'), signup.surname.ilike(f'%{query}%'))).paginate(page=page, per_page=9999)
    return render_template("signup.html", pagination=pagination, query=query)

@app.route("/signup/<int:signup_id>")
def signup_details(book_id):
    booking = signup.query.get_or_404(book_id)
    return render_template("signup.html", signup=signup)

@app.route("/signup/create", methods=["GET"])
def create_email():
    return render_template("create_email.html", email=email.query.all(), signup=signup.query.all())

    db.session.add(booking)
    db.session.commit()

    return redirect(url_for("signup"))
    db.session.commit()

    return redirect(url_for("signup"))

@app.route("/signup/<int:signup_id>/delete", methods=["GET"])
def signup_delete_action(signup_id):
    signup = signup.query.get(signup_id)
    db.session.delete(signup)
    db.session.commit()

    return redirect(url_for("signup"))

@app.route("/api/", methods=['GET'])
def rest_index():
    return jsonpickle.encode(signup.query.all())

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)