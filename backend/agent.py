from typing import Annotated, List, Literal
from typing_extensions import TypedDict
from langgraph.graph import StateGraph, START, END
from langgraph.graph.message import add_messages
from langchain_core.messages import BaseMessage, HumanMessage, AIMessage, SystemMessage
from langchain_openai import ChatOpenAI
from langchain_core.tools import tool
from langgraph.prebuilt import ToolNode
from langgraph.checkpoint.memory import MemorySaver
import os
import tools
from dotenv import load_dotenv

load_dotenv()

# Define tools
@tool
def read_excel_structure_tool(file_path: str):
    """Reads the sheet names and columns of an Excel file. Use this to understand the file structure."""
    return tools.read_excel_structure(file_path)

@tool
def read_excel_values_tool(file_path: str, sheet_name: str, range_string: str = None):
    """
    Reads values from a specific sheet. 
    range_string can be 'A1', 'A1:B2', or None (reads used range).
    """
    return tools.read_excel_values(file_path, sheet_name, range_string)

@tool
def add_excel_row_tool(file_path: str, sheet_name: str, data: List[str]):
    """Appends a row to an Excel sheet. data should be a list of values."""
    return tools.add_excel_row(file_path, sheet_name, data)

@tool
def read_word_text_tool(file_path: str):
    """Reads the text content of a Word file."""
    return tools.read_word_text(file_path)

@tool
def append_word_text_tool(file_path: str, text: str):
    """Appends a paragraph of text to a Word file."""
    return tools.append_word_text(file_path, text)

@tool
def replace_word_text_tool(file_path: str, old_text: str, new_text: str):
    """Replaces occurrences of text in a Word file."""
    return tools.replace_word_text(file_path, old_text, new_text)

@tool
def apply_excel_style_tool(file_path: str, sheet_name: str, target_range: str, bold: bool = None, italic: bool = None, color: str = None, bg_color: str = None):
    """
    Applies styles to Excel cells. 
    target_range: 'A1', 'A1:B2', 'A' (column), or '1' (row).
    color/bg_color: Hex codes (e.g. 'FF0000').
    bold/italic: True/False.
    """
    return tools.apply_excel_style(file_path, sheet_name, target_range, bold, italic, color, bg_color)

@tool
def delete_excel_row_tool(file_path: str, sheet_name: str, row_idx: int):
    """Deletes a row from an Excel sheet. row_idx is 1-based index (e.g., 2)."""
    return tools.delete_excel_row(file_path, sheet_name, row_idx)

@tool
def delete_excel_column_tool(file_path: str, sheet_name: str, col_idx: str):
    """Deletes a column from an Excel sheet. col_idx can be a letter (e.g., 'A') or index."""
    return tools.delete_excel_column(file_path, sheet_name, col_idx)

@tool
def merge_excel_cells_tool(file_path: str, sheet_name: str, range_string: str):
    """Merges cells in the specified range (e.g., 'A1:B2')."""
    return tools.merge_excel_cells(file_path, sheet_name, range_string)

@tool
def unmerge_excel_cells_tool(file_path: str, sheet_name: str, range_string: str):
    """Unmerges cells in the specified range (e.g., 'A1:B2')."""
    return tools.unmerge_excel_cells(file_path, sheet_name, range_string)

@tool
def write_excel_cell_tool(file_path: str, sheet_name: str, cell: str, value: str):
    """Writes a value to a specific cell (e.g., 'A1')."""
    return tools.write_excel_cell(file_path, sheet_name, cell, value)

<<<<<<< HEAD
# List of tools
my_tools = [read_excel_structure_tool, read_excel_values_tool, add_excel_row_tool, read_word_text_tool, append_word_text_tool, replace_word_text_tool, apply_excel_style_tool, delete_excel_row_tool, delete_excel_column_tool, merge_excel_cells_tool, unmerge_excel_cells_tool, write_excel_cell_tool]
=======
@tool
def insert_excel_column_tool(file_path: str, sheet_name: str, col_idx: int):
    """Inserts a new column at the specified index. col_idx is 1-based index."""
    return tools.insert_excel_column(file_path, sheet_name, col_idx)

my_tools = [read_excel_structure_tool, read_excel_values_tool, add_excel_row_tool, read_word_text_tool, append_word_text_tool, replace_word_text_tool, apply_excel_style_tool, delete_excel_row_tool, delete_excel_column_tool, merge_excel_cells_tool, unmerge_excel_cells_tool, write_excel_cell_tool, insert_excel_column_tool]
tools_map = {t.name: t for t in my_tools}
>>>>>>> 87484200 (Updated agent planning mode.)

# Define the state
class AgentState(TypedDict):
    messages: Annotated[List[BaseMessage], add_messages]
    file_path: str
    file_type: str
<<<<<<< HEAD

# Initialize LLM with tools
# Ensure OPENAI_API_KEY is in environment variables
llm = ChatOpenAI(model="gpt-5", temperature=0)
llm_with_tools = llm.bind_tools(my_tools)
=======
    
# --- Model definition ---
llm = ChatOpenAI(model="gpt-4o", temperature=0)
>>>>>>> 87484200 (Updated agent planning mode.)

def agent_node(state: AgentState):
    # Construct a system message with context
    file_path = state.get("file_path", "Unknown")
    file_type = state.get("file_type", "Unknown")
    
    system_prompt = f"""You are an intelligent AI agent helping a user edit a file.
File Path: {file_path}
File Type: {file_type}

You have tools to read and modify this file. 
Always verify the structure/content before making edits if you are unsure.
Refrain from asking the user for the file path, you already have it.
"""
    
    # Invocation
    messages = [SystemMessage(content=system_prompt)] + state["messages"]
    response = llm_with_tools.invoke(messages)
    return {"messages": [response]}

def should_continue(state: AgentState) -> Literal["tools", END]:
    messages = state["messages"]
    last_message = messages[-1]
    last_message_content = last_message.content
    
    # Check if tool calls exist
    if last_message.tool_calls:
        return "tools"
    return END

# Build Graph
builder = StateGraph(AgentState)
builder.add_node("agent", agent_node)
builder.add_node("tools", ToolNode(my_tools))

builder.add_edge(START, "agent")
builder.add_conditional_edges("agent", should_continue)
builder.add_edge("tools", "agent")

memory = MemorySaver()
graph = builder.compile(checkpointer=memory)

async def run_agent(message: str, file_path: str, session_id: str = "default"):
    """Runs the agent on a message context."""
    file_type = "Excel" if file_path.endswith((".xlsx", ".xls")) else "Word" if file_path.endswith((".docx", ".doc")) else "Unknown"
    
    # Check if this is a new session or existing
    # LangGraph handles thread_id. If thread_id exists, it resumes.
    
    config = {"configurable": {"thread_id": session_id}}
    
    initial_state = {
        "messages": [HumanMessage(content=message)],
        "file_path": file_path,
        "file_type": file_type
    }
    
    result = await graph.ainvoke(initial_state, config=config)
    
    # Extract the final AIMessage content
    last_msg = result["messages"][-1]
    
    # Handle both string and object content formats
    content = last_msg.content
    if isinstance(content, str):
        response_text = content
    elif isinstance(content, list):
        # If content is a list of content blocks, extract text
        response_text = " ".join([
            block.get("text", "") if isinstance(block, dict) else str(block)
            for block in content
        ])
    elif isinstance(content, dict):
        # If content is a dict with 'text' field
        response_text = content.get("text", str(content))
    else:
        response_text = str(content)
    
    return {"response": response_text}
