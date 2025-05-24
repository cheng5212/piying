@echo off
setlocal enabledelayedexpansion

 echo ==================== 后端服务诊断脚本 ====================
 echo 1. 检查项目依赖是否安装...
if exist "c:\Users\18220\Desktop\pr\node_modules" (
    echo 依赖已安装。
) else (
    echo 错误：未找到node_modules目录，请先在项目目录运行npm install！
    exit /b 1
)

 echo 2. 检查端口3002是否被监听...
set PORT_LISTENING=0
for /f "tokens=4" %%a in ('netstat -ano ^| findstr ":3002" ^| findstr "LISTENING"') do (
    set PORT_LISTENING=1
)
if !PORT_LISTENING!==1 (
    echo 端口3002已被监听。
) else (
    echo 端口3002未被监听，尝试启动后端服务...
    start cmd /k "cd c:\Users\18220\Desktop\pr & npm run dev"
    timeout /t 5 /nobreak >nul
)

 echo 3. 测试/api/send-email接口...
set TEST_DATA={"productName":"测试商品","quantity":"1","address":"测试地址","phone":"1234567890","name":"测试用户"}
curl -X POST -H "Content-Type: application/json" -d "!TEST_DATA!" http://localhost:3002/api/send-email -o response.txt
set /p RESPONSE=<response.txt
del response.txt

echo 接口响应：!RESPONSE!
if "!RESPONSE!"=="{\"message\":\"邮件发送成功\"}" (
    echo 接口测试成功。
) else (
    echo 接口测试失败，请检查后端日志！
)

echo ==================== 诊断完成 ====================
pause"}}}
