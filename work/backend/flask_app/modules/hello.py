from flask import Blueprint

blueprint=Blueprint("hello",__name__,url_prefix='/hello')

@blueprint.route('/say',methods=["GET"])
def sauHEllo():
    return "hello"