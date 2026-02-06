from django.shortcuts import render
from django.shortcuts import HttpResponse
from datetime import date

all_posts=[
    {"slug":"code-in-python",
     "image": "python1.jpeg",
     "author":"Zafar Aftab",
     "date":date(2024,11,19),
    "title": "Coding in Python",
     "excerpt":"Python is a remarkable programming language that stands out for its elegance, versatility, and power.",
    "content":"""Coding in Python
Python is a versatile, easy-to-learn programming language that emphasizes readability and simplicity. It is widely used for web development, data analysis, machine learning, automation, and more. Python supports multiple programming paradigms, including procedural, object-oriented, and functional programming, making it a go-to language for beginners and experienced developers alike.

Features of Python for Coding

Simple and Readable Syntax: Python's syntax is clean and resembles plain English, making it accessible to beginners.
Dynamic Typing: You don’t need to declare variable types explicitly, as Python infers them automatically.
Extensive Libraries: Libraries like NumPy, pandas, Django, Flask, TensorFlow, and Matplotlib extend Python's capabilities for various domains.
Interpreted Language: Python code is executed line by line, which simplifies debugging and allows for rapid prototyping.
Cross-Platform Compatibility: Python runs on Windows, macOS, and Linux, ensuring portability.

Applications of Python Coding.

Web Development: Frameworks like Django and Flask make it easy to build robust web applications.
Data Science and Analysis: Python is widely used for data manipulation and visualization with libraries such as pandas and Matplotlib.
Machine Learning and AI: TensorFlow, PyTorch, and Scikit-learn enable the creation of intelligent models.
Automation: Python simplifies repetitive tasks with tools like Selenium and PyAutoGUI.
Game Development: Libraries like Pygame help in developing simple games.
Scientific Computing: SciPy and NumPy are used for advanced mathematical computations."""
     },
    {
"slug":"Backend-Development-using-Django",
     "image": "django1.jpeg",
     "author":"Zafar Aftab",
     "date":date(2024,11,19),
    "title": "Backend Development using Django",
     "excerpt":"Django is a high-level Python web framework that enables you to build robust, scalable,and maintainable backend systems for web applications.",
     "content":"Django is a high-level Python web framework that allows developers to quickly build robust, scalable, and secure web applications. It follows the Model-View-Template (MVT) architectural pattern and provides a clean and pragmatic design for creating web applications. Django is widely used for backend development because of its simplicity, scalability, and rich feature set."
     },

{
"slug":"Cloud-Computing-Using-AWS",
     "image": "aws.jpg",
     "author":"Zafar Aftab",
     "date":date(2024,11,19),
    "title": "Cloud Computing Using AWS",
     "excerpt":"Amazon Web Services (AWS) is one of the leading platforms for cloud computing, offering a wide range of services to build, deploy, and scale applications efficiently",
        "content":"Cloud Computing is the delivery of computing services—such as servers, storage, databases, networking, software, and analytics—over the internet, or the cloud. which offers faster innovation, flexible resources, and economies of scale. Instead of owning their own computing infrastructure or data centers, businesses can rent access to anything from applications to storage from a cloud service provider, like Amazon Web Services (AWS)."
     }
]
def get_date(post):
    return post["date"]

def startingPage(request):
    sorted_posts=sorted(all_posts,key=get_date)
    latest_post=sorted_posts[-3:]
    return render(request, "blog/index.html",{
        "posts":latest_post})
def post(request):
    return render(request,"blog/allPost.html",
    {
        "all_posts":all_posts
    })
def postDetails(request,slug):
    identifiedPost=next(post for post in all_posts if post["slug"] == slug)
    return render(request,"blog/postDetail.html",{
        "post":identifiedPost

    })

from django.utils.text import slugify

def create_slug(post_title):
    return slugify(post_title)  # This will replace spaces with hyphens
