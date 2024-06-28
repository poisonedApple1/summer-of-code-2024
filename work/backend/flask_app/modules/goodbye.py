from flask import Blueprint

blueprint=Blueprint("goodbye",__name__,url_prefix="/goodbye")

@blueprint.route('/say',methods=["GET"])
def say_bye():
    return "goodbye!"