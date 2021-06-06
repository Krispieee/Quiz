from flask import render_template,request,jsonify,url_for,redirect,send_file,Response
from Application import app,db,mail
from .models import Quiz,Question,Answer,Option,QuestionSchema,OptionSchema,AnswerSchema, Creater, Player,Feedback
from flask_jwt_extended import jwt_manager, jwt_required, create_access_token
from flask_mail import Message
from sqlalchemy import desc
from .routeDef import GetQuizDetails
import pandas as pd
import json
import datetime,time

@app.shell_context_processor
def forShell():
    return dict(app=app,db=db)

@app.route('/api/login',methods=['POST'])
def login():
    if request.is_json:
        email = request.json['email']
        password = request.json['password']
    else:
        email = request.form['email']
        password = request.form['password']

    creater = Creater.query.filter_by(email=email.lower(),password=password).first()
    if creater:
        access_token =  create_access_token(identity=email,expires_delta=datetime.timedelta(hours=1))
        return jsonify(message="Login Success",access_token=access_token,creater_email=email), 200
    else:
        return jsonify(message="Invalid username and password"),401

@app.route('/api/create-user',methods=['POST'])
def createUser():
    if request.is_json:
        username=request.json['username']
        email=request.json['email']
        password=request.json['password']
    else:
        username=request.form['username']
        email=request.form['email']
        password=request.form['password']

    creater = Creater(username=username,email=email.lower(),password=password)
    db.session.add(creater)
    db.session.commit()
    return jsonify(message="User created")


@app.route('/api/post-questions',methods=['GET','POST'])
@jwt_required
def post_questions():
    
    if request.is_json:
        if request.json['password']:
            creater = Creater.query.filter_by(email=request.json['creater_email']).first()
            quiz=Quiz(group_code=request.json['password'],title=request.json['questionSet']['title'],creater=creater)
        else:
            quiz=Quiz(title=request.json['questionSet']['title'],creater=request.json['creater_email'])

        db.session.add(quiz)
        for req in request.json['questionSet']['questions']:
            question=Question(question=req['question'],quiz=quiz)
            db.session.add(question)
            for option in req['options']:
                db.session.add(Option(option=option,question=question))
            for answer in req['answers']:
                db.session.add(Answer(answer=answer,question=question))

            db.session.commit()
        data={}
        quiz=Quiz.query.order_by(-Quiz.id).first()
        data['id']=quiz.id

        return jsonify(message="success",data=data)


@app.route('/api/lobby-details')
def getDetailsForLobby():
    details=[]
    for quiz in Quiz.query.all():
        dic={}
        dic["id"]=quiz.id
        dic["title"]=quiz.title
        dic["password"]=True if quiz.group_code else False
        details.append(dic)
    return jsonify(details=details)


app.add_url_rule('/api/quiz/<int:id>',view_func=GetQuizDetails.as_view('getQuizDetails'))  
# @app.route('/api/quiz/<int:id>')
# def getQuiz(id):
#     quiz = Quiz.query.filter_by(id=id).first()
#     questions = quiz.questions
#     questionSchema=QuestionSchema(many=True)
#     questionsData=questionSchema.dump(questions)
#     for quesData,ques in zip(questionsData,questions):
#         quesData['option']=[opt.option for opt in ques.options]
#         quesData['answer']=[ans.answer for ans in ques.answers]
    
#     if quiz.group_code:
#         return jsonify(questions=questionsData,quiz_id=id,password=quiz.group_code),200
#     return jsonify(questions=questionsData,quiz_id=id),200

@app.route('/api/submit-quiz',methods=['POST'])
def submitQuiz():
    if request.is_json:
        player_name = request.json['player']
        score = request.json['score']
        quiz_id=request.json['quiz_id']
        No_of_ques=request.json['no_of_ques']
    else:
        player_name = request.form['player']
        score = request.form['score']
        quiz_id=request.form['quiz_id']
        No_of_ques=request.form['no_of_ques']
    player = Player(name=player_name,score=score,quiz_id=quiz_id, no_of_ques=No_of_ques)
    db.session.add(player)
    db.session.commit()
    return jsonify(message="Submitted successfully")
    

@app.route('/api/Emails')
def getEmails():
    emails=[]
    for creater in Creater.query.all():
        emails.append(creater.email)
    return jsonify(emails=emails)
    

@app.route('/api/recovery',methods=['POST'])
def passwordRecovery():
    email=''
    print(request.is_json)
    if request.is_json:
        email=request.json['email'].lower()
        #print('email'+email)
    else:
        email=request.form['email'].lower()
    creater = Creater.query.filter_by(email=email).first()
    print(type(email)) 
    if creater:
        info = '<h3>Follow the link below to change your password</h3>'+'http://localhost:4200/forgot-password/'+email+'/'+ create_access_token(email)
        msg = Message(subject="Account recovery", html=info, recipients=[email],sender=app.config['MAIL_USERNAME'])
        mail.send(msg)
        return "email sent"
    else:
        return jsonify(message="Email Id doesn't exist"),401


@app.route('/api/update-password',methods=['PUT','POST'])
@jwt_required
def updatePassword():
    #print(request.json['email'])
    if request.is_json:
        password=request.json['password']
        email=request.json['email']
    else:
        email=request.form['email']
        password=request.form['password']
    creater = Creater.query.filter_by(email=email).first()
    if creater:
        creater.password=password
        db.session.commit()
        return jsonify(message="updated succesfully")
    else:   
        return jsonify(message="Invalid request"), 401

        
@app.route('/api/getProfile/<string:email>')
@jwt_required
def getProfile(email):
    creater = Creater.query.filter_by(email=email).first()
    if creater:
        profile={}
        profile['username']=creater.username
        profile['quiz']=[]
        for quiz in creater.quiz:
            message={}
            message['id']=quiz.id
            message['title']=quiz.title
            profile['quiz'].append(message)
        return jsonify(profile=profile),200
    else:
        return jsonify(message="Invalid request"),401

@app.route('/api/feedback',methods=['POST'])
def feedback():
    if request.is_json:
        rating = request.json['rating']
        suggestion = request.json['suggestion']
    else:
        rating = request.form['rating']
        suggestion = request.form['suggestion']
    feedback = Feedback(suggestion=suggestion,rating=rating)
    db.session.add(feedback)
    db.session.commit()
    return jsonify(message='feedback submitted')

@app.route('/api/report/<id>')
def getReport(id):
    quiz = Quiz.query.filter_by(id=id).first()
    if quiz:
        filename = f'ques.zillion_{id}_report.csv' 
        players = quiz.players
        player_name=[]
        score=[]
        for player in players:
            player_name.append(player.name)
            score.append(player.score)

        df = pd.DataFrame({'Player_name':player_name,'Score':score})
        df.to_csv('Application/static/reports/'+filename,index=False)
        
        return send_file(f'static/reports/{filename}',
                        mimetype='text/csv',
                        attachment_filename=filename,
                        as_attachment=True)
    else:
        return 'Something went wrong',404

@app.route('/api/results/<id>')
def getResults(id):
    quiz = Quiz.query.filter_by(id=id).first()
    if quiz:
        players = quiz.players
        players_details = []
        for player in players:
            players_details.append({"name":player.name,"score":player.score,"no_of_ques":player.no_of_ques})
        
        return jsonify(message='Success', data= players_details)
        
    else:
        return 'Something went wrong',404

@app.route('/api/detailedQuiz/<id>')
def detailedQuiz(id):
    quiz = Quiz.query.filter_by(id=id).first()
    quizData={}
    if quiz:
        quizData['id'] = quiz.id
        quizData['title']= quiz.title
        quizData['questions']=[]
        questions = quiz.questions
        for ques in questions:
            quesDict = {}
            quesDict['question'] = ques.question
            quesDict['id'] = ques.id
            quesDict['answers']=[]
            quesDict['options']=[]
            for answer in ques.answers:
                quesDict['answers'].append({'id':answer.id,'answer':answer.answer})
            for option in ques.options:
                quesDict['options'].append({'id':option.id,'option':option.option})
            quizData['questions'].append(quesDict)
        
        return jsonify(message=quizData)
            
    else:
        return 'Something went wrong',404

@app.route("/api/updateQuiz",methods=["POST"])
def updateQuiz():
    if request.is_json:
        password = request.json["password"]
        quizId = request.json["quizId"]
        questions = request.json["questions"]
        creater_email = request.json["creater_email"]
        title = request.json["title"]
    quiz = Quiz.query.filter_by(id=quizId).first()
    if not quiz:
        return jsonify(message="No quiz found with that Id"), 404
    quiz.title = title
    if password:
        quiz.group_code = password
    else:
        quiz.group_code = ""
    quizQuestions = quiz.questions
    for quesIndex, reqQues in enumerate(questions):
        if reqQues.get("id"):
            if reqQues.get("toBeDeleted"):
                ques = Question.query.filter_by(id=reqQues.get("id")).first()
                db.session.delete(ques)
                continue
            quizQuestions[quesIndex].question = reqQues["question"]
            reqOptions = reqQues.get('options')
            for optIndex, reqOpt in enumerate(reqOptions):
                if reqOpt.get("id"):
                    if not reqOpt["option"]:
                        db.session.delete(Option.query.filter_by(id=reqOpt.get("id")).first())
                        continue
                    Option.query.filter_by(id=reqOpt.get("id")).first().option = reqOpt["option"]
                else:
                    db.session.add(Option(option=reqOpt["option"],question=quizQuestions[quesIndex]))
            reqAnswers = reqQues.get('answers')
            for ansIndex, reqAns in enumerate(reqAnswers):
                if reqAns.get("id"):
                    if not reqAns["answer"]:
                        db.session.delete(Answer.query.filter_by(id=reqAns.get("id")).first())
                        continue
                    Answer.query.filter_by(id=reqAns.get("id")).first().answer = reqAns["answer"]
                else:
                    db.session.add(Answer(answer=reqAns["answer"],question=quizQuestions[quesIndex]))
        else:
            newQues = Question(question=reqQues["question"],quiz=quiz)
            db.session.add(newQues)
            for opt in reqQues["options"]:
                db.session.add(Option(option=opt["option"],question=newQues))
            for ans in reqQues["answers"]:
                db.session.add(Answer(answer=ans["answer"],question=newQues))

    db.session.commit()
    return jsonify("Updates was successful"), 200
                    
                    
            
    

    
