const express = require('express');
const { NodeSSH } = require('node-ssh');

const app = express();
const port = 3000;
const ssh = new NodeSSH();
const bodyParser = require('body-parser');
// Configuração de CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});
app.use(bodyParser.json());

let savehostName;
let saveuserName;
let savesenha;
app.post('/login', (req, res) => {
    const { hostName, userName,senha } = req.body;
    savehostName = hostName
    saveuserName = userName
    savesenha    = senha
    console.log(`Suas variaveis são ${savesenha} ${saveuserName} ${savehostName}`)
});



app.get('/startServer', async (req, res) => {
    try {
        await ssh.connect({
            host: `${savehostName}`,
            username: `${saveuserName}`,
            tryKeyboard: true,
            password: `${savesenha}`
        });

        const result = await ssh.execCommand(`bash /home/${saveuserName}/Minecraftserver/iniciar.sh`, { cwd: `/home/${saveuserName}/Minecraftserver` });

        console.log(result);

        res.send('Comando executado com sucesso.');
    } catch (error) {
        console.error('Erro ao conectar ao servidor SSH:', error);
        res.status(500).send('Erro ao conectar ao servidor SSH');
    }finally{
        ssh.dispose();
    }
});

app.get('/stopServer', async (req,res)=> {
    try {
        await ssh.connect({
            host: `${savehostName}`,
            username: `${saveuserName}`,
            tryKeyboard: true,
            password: `${savesenha}`
        });

        const result = await ssh.execCommand("kill $(ps aux | grep '[s]erver.jar' | awk '{print $2}')", {
            cwd: `/home/${saveuserName}/ServerMinecraft` });

        console.log(result);

        res.send('Comando executado com sucesso.');

    } catch (err) {
        console.error('Erro ao parar o servidor via SSH:', err);
        res.status(500).send('Erro ao parar o servidor.');
    }
    finally{
        ssh.dispose();
    }
});


app.listen(port, () => {
    console.log(`Servidor Express iniciado na porta ${port}`);
});
