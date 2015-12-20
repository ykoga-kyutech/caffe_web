// Set the rosbridge and mjpeg_server port
var rosbridgePort = "9090";
var mjpegPort = "8080";

// Get the current hostname
thisHostName = document.location.hostname;

// Set the rosbridge and mjpeg server hostname accordingly
var rosbridgeHost = thisHostName;
var mjpegHost = thisHostName;

// Build the websocket URL to the rosbride server
var serverURL = "ws://" + rosbridgeHost + ":" + rosbridgePort;

// The mjpeg client object that will be defined later
var mjpegViewer;

// The default video topic (can be set in the rosbridge launch file)
var videoTopic = "/image_raw";


// The mjpeg video quality (percent)
var videoQuality = 50;

// The ROS namespace containing parameters for this script
var param_ns = '/robot_gui';

// Get the current window width and height
var windowWidth = this.window.innerWidth;
var windowHeight = this.window.innerHeight;

// Set the video width to 1/2 of the window width and scale the height
// appropriately.
var videoWidth = Math.round(windowWidth / 2.0);
var videoHeight = Math.round(videoWidth * 240 / 320);

//The main ROS object
var ros = new ROSLIB.Ros();

// Connect to ROS
function init_ros() {
        ros.connect(serverURL);
        
        // Set the rosbridge host and port values in the form
        document.getElementById("rosbridgeHost").value = rosbridgeHost;
        document.getElementById("rosbridgePort").value = rosbridgePort;
}

// If there is an error on the back end, an 'error' emit will be emitted.
ros.on('error', function(error) {
        console.log("Rosbridge Error: " + error);
	document.getElementById('state').innerHTML = "Error";
});

this.ros.on('close', function(error) {
	document.getElementById('state').innerHTML = "Close";
	document.getElementById("btn").disabled = true;
});

// Wait until a connection is made before continuing
ros.on('connection', function() {
        console.log('Rosbridge connected.');
	document.getElementById('state').innerHTML = "Connect";

        // Create a Param object for the video topic
        var videoTopicParam = new ROSLIB.Param({
                ros : ros,
                name : param_ns + '/videoTopic'
        });

        videoTopicParam.get(function(value) {
            if (value != null) {
                videoTopic = value;
            }
                
            // Create the video viewer
            if (!mjpegViewer) {
                mjpegViewer = new MJPEGCANVAS.Viewer({
                    divID : 'videoCanvas',
                    host : mjpegHost,
                    port : mjpegPort,
                    width : videoWidth,
                    height : videoHeight,
                    quality : videoQuality,
                    topic : videoTopic
                });
            }
        });

        
        var sub = new ROSLIB.Topic({
                ros : ros,
                name : 'ros_caffe/predictions',
                messageType : 'std_msgs/String'
        });
        sub.subscribe(function(message) {
                var msg = message.data;
                var result = msg.replace(/\n/g,"<BR>");
                document.getElementById("caffe_result").innerHTML = result;
        });

});


function connectDisconnect() {
        var connect = document.getElementById('connectROS').checked;

        if (connect)
                connectServer();
        else
                disconnectServer();
}

function disconnectServer() {
        console.log("Disconnecting from ROS.");
        mjpegViewer.changeStream();
        ros.close();
}

function connectServer() {
        rosbridgeHost = document.getElementById("rosbridgeHost").value;
        rosbridgePort = document.getElementById("rosbridgePort").value;
        serverURL = "ws://" + rosbridgeHost + ":" + rosbridgePort;
        mjpegViewer.changeStream(videoTopic);
        try {
                ros.connect(serverURL);
                console.log("Connected to ROS.");
        } catch (error) {
                console.write(error);
        }
}
