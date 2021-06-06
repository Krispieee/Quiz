from Application import db
from sqlalchemy import Column,Integer,String,ForeignKey
from Application import ma

class Creater(db.Model):
    id = Column(Integer,primary_key=True)
    username = Column(String)
    email = Column(String, unique=True)
    password = Column(String)
    quiz = db.relationship('Quiz', backref='creater')

class Quiz(db.Model):
    id=Column(Integer,primary_key=True)
    group_code = Column(String,default='')
    title = Column(String,nullable=False)
    questions = db.relationship('Question',backref='quiz')
    creater_mail_id = Column(Integer,ForeignKey('creater.id'),nullable=False)
    players = db.relationship('Player',backref="quiz")

class Player(db.Model):
    id = Column(Integer,primary_key=True)
    name = Column(String)
    quiz_id = Column(Integer,ForeignKey('quiz.id'),nullable=False)
    score = Column(Integer,default=0)
    no_of_ques = Column(Integer, default=0 )

class Question(db.Model):
    id=Column(Integer,primary_key=True)
    question=Column(String)
    quiz_id = Column(Integer,ForeignKey('quiz.id'))
    options = db.relationship('Option',backref='question',cascade="all, delete-orphan")
    answers = db.relationship('Answer',backref='question',cascade="all, delete-orphan")

class Option(db.Model):
    id=Column(Integer,primary_key=True)
    option=Column(String)
    question_id = Column(Integer,ForeignKey('question.id',ondelete="cascade"))

class Answer(db.Model):
    id=Column(Integer,primary_key=True)
    answer=Column(String)
    question_id = Column(Integer,ForeignKey('question.id',ondelete="cascade"))

class Feedback(db.Model):
    id=Column(Integer,primary_key=True)
    rating = Column(Integer,default=0)
    suggestion = Column(String)



#Schemas
class QuestionSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model=Question

class OptionSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model=Option

class AnswerSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model=Answer