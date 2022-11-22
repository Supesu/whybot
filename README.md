<h1 align="center"> Whynotbebot </h1>
<p>This is the official whybot sourcecode for the Backend & Frontend along with basic instructions for running a local instance</p>

<h2> :floppy_disk: Project Layout</h2>

<p>This Project Is split into two parts - WEB & SERVER</p>

<h4>Server</h4>
<ul>
  <li><b>src</b> - Contains all the sourcecode for the backend </li>
    <ul>
    <li><b>config</b> - this contains all of the code for manipulating the environmental variables into configs that TMI.js accepts</li>
    <li><b>lib</b></li>
        <ul>
            <li><b>analytics</b> - contains the code for the  analytics client</li>
            <li><b>api</b> - the api that allows the ability to update/view the currently loaded commands along with a basic auth server  ($ENV_PORT)</li>
            <li><b>database</b> - the database client that wraps over firebase</li>
            <li><b>store</b> - this a bit of a weird one,  pretty much an object that persists outside of the lifecycle of the command </li>
            <li><b>twitch</b></li>
            <ul>
                <li><b>client</b> - code for handling the client</li>
                <li><b>command</b> - </li>
                <ul>
                    <li><b>contract</b> - typings for the commands </li>
                    <li><b>custom</b> - the code for loading custom commands</li>
                    <li><b>uniques</b> - these are the actual inbuilt command files</li>
                    <li><b>ordinaries</b> - this is a feature for the future, similar to uniques</li>
                    <li><b>router.ts</b> - the router to router messages to inbuilt/custom commands</li>
                </ul>
            </ul>
        </ul>
    <li><b>utils</b></li>
        <ul>
            <li><b>Methods.ts</b> - a couple of helper commands</li>
            <li><b>Logger.ts</b> - a custom logger - use this... it looks nice</li>
        </ul>
    <li><b>constants.ts</b></li>
    <li><b>env.d.ts</b> - these are the types for the environmental variables.. use `npm run gen-env` to generate these types after editing `.env`</li>
    <li><b>index.ts</b> - this is the main file for the backend - everything will be run here.</li>
    </ul>
</ul>

<h4>Web: (pretty typical react project, so will not document this as extensively)</h4>
<ul>
  <li><b>src</b> - Contains all the sourcecode for the frontend</li>
</ul>

![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png)

<h2> :clipboard: Execution Instruction</h2>
<p>The order of execution of the program files is as follows:</p>
<p><b>1) cd server && cp .env.example .env</b></p>
<p>fill out the file that's created with all the required information</p>
<p><b>yarn</b></p>
<p>this will install all required dependencies.</p>
<p><b>yarn run watch</b></p>
<p>this will run the build script,  along with injecting the env variables and running a watch script.</p>

![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png)

<!-- CREDITS -->
<h2 id="credits"> :scroll: Credits</h2>

Kian Merchant

[![GitHub Badge](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/supesu)
[![Twitter Badge](https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://twitter.com/supesuOCE)
[![LinkedIn Badge](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/kian-merchant)