from django.shortcuts import render
from django.http import JsonResponse
from openai import OpenAI
import markdown

def home(request):
    return render(request, 'home.html')

def jabir_startchat(request):
        clientJabir = OpenAI(api_key="FAKE", base_url="https://openai.jabirproject.org/v1")

        if request.method == 'POST':
            user_input = request.POST.get('user_input', '')

            full = clientJabir.chat.completions.create(
                model = "jabir-400b",
                messages = [
                {
                    "role": "user",
                    "content": user_input
                }
                ]
            )
            result_markdown = full.choices[0].message.content
            result_html = markdown.markdown(result_markdown)
            return JsonResponse({'message': result_html})
        return JsonResponse({'message': 'درخواست نامعتبر است.'}, status=400)