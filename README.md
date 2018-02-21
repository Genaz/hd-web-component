# hd-web-component
Steps to run the application:
1. Clone application from the following url: https://github.com/Genaz/hd-web-component.git
2. In the terminal, run npm install command to install that are needed mostly for development and to run  a local server.
3. Run gulp command.

What's been implemented:
1) Currency converter web component.
2) Container page that contains 3 instances of the web component.
3) Added option to specify requested source and target currencies within the component attributes.
4) Added validation on source amount.
5) Added validation on api error.
6) Added toggle disclaimer information.
7) Added calculation of target currency amount, on source amount change and on currency change.
8) Added responsive styles to the component.

Additional tasks to do: 
1) Implement caching for exchange rate retrieval, since data updated only once a day it can be stored locally and retieved from server only when updated list is available.
2) Improve UI.
3) Add unit testing.

Some of the additional functionalities that I think can be added :
1) Add button to switch between target and source currency
2) Add graph to display some rates history.




