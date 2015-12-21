# caffe_web

This package shows web page showing video image captured by web camera and label estimated by "Caffe".
The environment is provided as Docker image called "ykoga/ros_caffe_cpu". 
All of the background process is executed on the ROS environment.

![caffe_result](https://raw.githubusercontent.com/ykoga-kyutech/caffe_web/master/ros_caffe_web_result.png)

# Install

```bash
# Run container
docker run -it --rm -p 8080:8080 -p 8085:8085 -p 9090:9090 ykoga/ros_caffe_cpu bash 

# In the container, then type these commands
cd ~/catkin_ws/src
git clone https://github.com/ykoga-kyutech/caffe_web.git
apt-get update
rosdep install -i -y --from-paths ./caffe_web
cd .. && catkin_make
source ./devel/setup.bash
```

# Run

```bash
# for opening terminals
tmux

# Terminal1
roslaunch caffe_web caffe_web.launch

# Terminal2
rosbag play --loop ~/catkin_ws/src/test_webcam.bag
```

Access the page on the web browser.

http://[IP ADDRESS OF THE MACHINE RUNNING ON THE caffe_web]:8085/caffe_web/index.html

Example: (local machine) http://127.0.0.1:8085/caffe_web/index.html

Then you can see the page showing video and the label estimated by Caffe like the above image.

You can use live image captured by your web camera instead of the bagfile. If you want, use ROS [uvc_camera](http://wiki.ros.org/uvc_camera) package for using and the UVC web camera and capturing live image.

Enjoy the Caffe!
