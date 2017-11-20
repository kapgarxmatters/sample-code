echo %*
powershell.exe -Command [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; ^
Invoke-RestMethod -Body {stuff=%*} -Method POST https://[xmatters instance]/api/integration/1/functions/0c60b547-b6de-4893-bc8d-26a086237c0a/triggers?apiKey=9ce4c505-e505-4f55-b8f8-5bf51d15825c


