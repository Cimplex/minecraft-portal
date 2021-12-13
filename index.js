const { SshClient } = require('./ssh-client.js');

SshClient.create();
SshClient.writeCommand("uptime");
