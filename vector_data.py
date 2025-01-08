from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain.schema import Document

# Load your document
with open('path of file', 'r', encoding="utf8") as file:
    data = file.read()

# Create vectorstore
document = Document(page_content=data)
text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
final_document = text_splitter.split_documents([document])

embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
vectorstore = FAISS.from_documents(documents=final_document, embedding=embeddings)

# Save the vectorstore
VECTORSTORE_PATH = "path to save"
vectorstore.save_local(VECTORSTORE_PATH)