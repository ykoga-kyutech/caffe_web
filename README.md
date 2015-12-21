# caffe_web
ROS + Caffe on the web with Docker.

# Install

```bash
# Run container
docker run -it --rm -p 8085:8085 -p 9090:9090 ykoga/ros_caffe_cpu bash 

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
# Terminal1
roslaunch caffe_web caffe_web.launch

# Terminal2
rosbag play --loop test_webcam.bag
```

Access the page on the web browser.

http://[IP ADDRESS OF THE MACHINE RUNNING ON THE caffe_web]:8085/caffe_web/index.html

Then you can see the page showing video and the label estimated by Caffe.

![caffe_result](https://raw.githubusercontent.com/ykoga-kyutech/caffe_web/master/ros_caffe_web_result.png)