from flask import Flask, request, jsonify
from flask_cors import CORS

import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain.chains import create_retrieval_chain
from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings



load_dotenv()
groq_api_key = os.getenv('GROQ_API_KEY')


app = Flask(__name__)


CORS(app, supports_credentials=True, CORS_SUPPORTS_CREDENTIALS = True)


embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")


VECTORSTORE_PATH = "vectors"  
try:
    
    vectorstore = FAISS.load_local(VECTORSTORE_PATH, embeddings=embeddings, allow_dangerous_deserialization = True)
    retriever = vectorstore.as_retriever(search_kwargs={"k": 3})
except Exception as e:
    raise RuntimeError(f"Failed to load FAISS vectorstore: {str(e)}")


llm = ChatGroq(
    groq_api_key=groq_api_key,
    model_name="llama-3.1-8b-instant",
    temperature=0.2
)

prompt = ChatPromptTemplate.from_template(
    """
        Answer the questions based on the provided context only.
        Please provide the most accurate response based on the question.
        <context>
        {context}
        <context>
        Questions: {input}
    """
)


document_chain = create_stuff_documents_chain(llm, prompt)
retrieval_chain = create_retrieval_chain(retriever, document_chain)


@app.route('/ask', methods=['POST'])

def ask_question():
    try:
        
        
        user_input = request.json.get("question", "")
        
        chat_history = request.json.get("chat_history", [])
        

        if not user_input:
            return jsonify({"error": "No question provided"}), 400

        
        response = retrieval_chain.invoke({
            "input": user_input,
            "chat_history": chat_history
        })
        

        
        chat_history.append({"role": "user", "content": user_input})
        chat_history.append({"role": "ai", "content": response['answer']})

        return jsonify({
            "question": user_input,
            "answer": response['answer'],
            "chat_history": chat_history[-5:]  
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.after_request
def after_request(response):
  response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
  response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
  response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
  response.headers.add('Access-Control-Allow-Credentials', 'true')
  return response


if __name__ == '__main__':
    app.run(host='0.0.0.0')
