from flask.views import MethodView
from .models import QuestionSchema,Quiz
from flask import jsonify

class GetQuizDetails(MethodView):
    def __init__(self):
        super().__init__()

    def get(self,id):
        quiz = Quiz.query.filter_by(id=id).first()
        questions = quiz.questions
        questionSchema=QuestionSchema(many=True)
        questionsData=questionSchema.dump(questions)
        for quesData,ques in zip(questionsData,questions):
            quesData['option']=[opt.option for opt in ques.options]
            quesData['answer']=[ans.answer for ans in ques.answers]
        
        if quiz.group_code:
            return jsonify(questions=questionsData,quiz_id=id,password=quiz.group_code),200
        return jsonify(questions=questionsData,quiz_id=id),200
