const { Client } = require('ssh2');
const conn = new Client();

var _isReady = false;
var _stream = null;

function createSshClient() {

	conn.on('ready', () => {
		console.log('Client :: ready');

		conn.shell(function(err, stream) {
			if (err) throw err;

			_stream = stream;
			_isReady = true;

			stream.on('close', function() {
				process.stdout.write('Connection closed.')
				console.log('Stream :: close');
				conn.end();

			}).on('data', function(data) {
				// pause to prevent more data from coming in
				process.stdin.pause()
				process.stdout.write(data)
				process.stdin.resume()
	
			}).stderr.on('data', function(data) {
				process.stderr.write(data);
			});

			process.on('SIGINT', function () {
				// stop input
				process.stdin.pause()
				process.stdout.write('\nEnding session\n')

				// close connection
				stream.end('exit\n')
			})
		});
	}).connect({
		host: 'localhost',
		port: 4422,
		username: 'mcbserver',
		privateKey: '/home/reuben/.ssh/mincraft_rsa'
	});
}

function writeCommand(input) {
	_stream.write(input.trim() + '\n')
}

exports.SshClient = {
	create: createSshClient,
	writeCommand: writeCommand,
};
