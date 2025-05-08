import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Timeline,
  Card,
  message,
  Spin,
  Layout,
  Typography,
  Button,
} from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { api } from "../services/api";
import { convertToSimplified } from "../utils/convert";
import { AMAP_CONFIG } from "../config";

const { Content } = Layout;
const { Title } = Typography;

interface ActivityPoint {
  name: string;
  location_name: string;
  relation_type: string;
  first_year: number;
  last_year: number;
  longitude: number;
  latitude: number;
  search_name: string;
}

export const ActivityMap: React.FC = () => {
  const { personId } = useParams<{ personId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [mapLoading, setMapLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activities, setActivities] = useState<ActivityPoint[]>([]);
  const [person, setPerson] = useState<any>(null);
  const mapRef = useRef<AMap.Map | null>(null);
  const markersRef = useRef<AMap.Marker[]>([]);
  const polylineRef = useRef<AMap.Polyline | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [messageApi, contextHolder] = message.useMessage();

  console.log("组件初始化 - personId:", personId);

  // 清理函数
  const cleanupMap = () => {
    console.log("执行地图清理");
    // 清理标记点
    if (markersRef.current.length > 0) {
      console.log("清理标记点");
      markersRef.current.forEach((marker) => {
        if (marker && mapRef.current) {
          marker.setMap(null);
        }
      });
      markersRef.current = [];
    }

    // 清理轨迹线
    if (polylineRef.current) {
      console.log("清理轨迹线");
      if (mapRef.current) {
        polylineRef.current.setMap(null);
      }
      polylineRef.current = null;
    }

    // 清理地图实例
    if (mapRef.current) {
      console.log("清理地图实例");
      mapRef.current.destroy();
      mapRef.current = null;
    }
  };

  // 组件卸载时清理
  useEffect(() => {
    return () => {
      console.log("组件卸载，执行清理");
      cleanupMap();
    };
  }, []);

  // 当 personId 改变时，清理并重新初始化
  useEffect(() => {
    console.log("personId 改变，执行清理和重新初始化");
    cleanupMap();
    setMapLoading(true);
    setActivities([]);
  }, [personId]);

  // 加载高德地图脚本
  useEffect(() => {
    console.log("开始加载地图脚本");
    const loadAMap = () => {
      return new Promise<void>((resolve, reject) => {
        if (window.AMap) {
          console.log("地图脚本已加载");
          resolve();
          return;
        }

        const script = document.createElement("script");
        script.type = "text/javascript";
        script.async = true;
        script.src = `https://webapi.amap.com/maps?v=${AMAP_CONFIG.version}&key=${AMAP_CONFIG.key}&plugin=AMap.Scale,AMap.ToolBar`;
        script.onerror = (error) => {
          console.error("地图脚本加载失败:", error);
          reject(new Error("地图加载失败"));
        };
        script.onload = () => {
          if (window.AMap) {
            console.log("地图脚本加载成功");
            resolve();
          } else {
            console.error("地图初始化失败");
            reject(new Error("地图初始化失败"));
          }
        };
        document.head.appendChild(script);
      });
    };

    loadAMap()
      .then(() => {
        console.log("地图加载完成");
        setMapLoading(false);
      })
      .catch((err) => {
        console.error("地图加载错误:", err);
        setError("地图加载失败，请刷新页面重试");
        messageApi.error("地图加载失败，请刷新页面重试");
      });

    return () => {
      cleanupMap();
    };
  }, []);

  // 初始化地图
  useEffect(() => {
    if (!mapLoading && mapContainerRef.current && !mapRef.current) {
      console.log("开始初始化地图");
      try {
        mapRef.current = new window.AMap.Map(mapContainerRef.current, {
          zoom: 5,
          center: [116.397428, 39.90923],
          viewMode: "2D",
          resizeEnable: true,
        });

        // 添加比例尺和工具栏
        mapRef.current.addControl(new window.AMap.Scale());
        mapRef.current.addControl(new window.AMap.ToolBar());

        console.log("地图初始化成功");
      } catch (err) {
        console.error("地图初始化错误:", err);
        setError("地图初始化失败");
        messageApi.error("地图初始化失败");
      }
    }
  }, [mapLoading]);

  // 获取数据
  useEffect(() => {
    const fetchPersonDetails = async () => {
      if (!personId) return;

      console.log("开始获取人物数据 - personId:", personId);
      setLoading(true);
      setError(null);

      try {
        console.log("获取人物基本信息");
        const personData = await api.getPerson(parseInt(personId));
        console.log("人物基本信息:", personData);
        // 转换人物信息为简体
        const simplifiedPersonData = {
          ...personData,
          basic_info: personData.basic_info
            ? {
                ...personData.basic_info,
                name_chn: convertToSimplified(
                  personData.basic_info.name_chn || ""
                ),
              }
            : undefined,
        };
        setPerson(simplifiedPersonData);

        console.log("获取活动轨迹数据");
        const activitiesData = await api.getPersonActivities(
          parseInt(personId)
        );
        console.log("活动轨迹数据:", activitiesData);
        // 转换活动数据为简体
        const simplifiedActivities = activitiesData.map((activity) => ({
          ...activity,
          location_name: convertToSimplified(activity.location_name || ""),
          relation_type: convertToSimplified(activity.relation_type || ""),
        }));
        setActivities(simplifiedActivities);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "获取数据失败";
        console.error("数据获取错误:", errorMessage);
        setError(errorMessage);
        setTimeout(() => {
          messageApi.error(errorMessage);
        }, 0);
      } finally {
        console.log("数据获取完成");
        setLoading(false);
      }
    };

    fetchPersonDetails();
  }, [personId, messageApi]);

  // 添加标记点和轨迹线
  useEffect(() => {
    if (!mapLoading && mapRef.current && activities.length > 0) {
      console.log("开始添加标记点和轨迹线");
      try {
        // 清除现有标记和轨迹线，但不销毁地图实例
        console.log("清除现有标记和轨迹线");
        markersRef.current.forEach((marker) => {
          if (marker && mapRef.current) {
            marker.setMap(null);
          }
        });
        markersRef.current = [];

        if (polylineRef.current) {
          if (mapRef.current) {
            polylineRef.current.setMap(null);
          }
          polylineRef.current = null;
        }

        // 过滤出有坐标的活动点并按时间排序
        const validActivities = activities
          .filter((activity) => {
            const isValid = activity.longitude && activity.latitude;
            if (!isValid) {
              console.log("无效的活动点:", activity);
            }
            return isValid;
          })
          .sort((a, b) => a.first_year - b.first_year);

        console.log("有效活动点数量:", validActivities.length);
        if (validActivities.length === 0) {
          console.log("没有有效的活动点");
          messageApi.warning("没有找到有效的活动地点数据");
          return;
        }

        // 创建轨迹线
        console.log("创建轨迹线");
        const path = validActivities.map(
          (activity) =>
            [activity.longitude, activity.latitude] as [number, number]
        );
        polylineRef.current = new window.AMap.Polyline({
          path: path,
          strokeColor: "#1890ff",
          strokeWeight: 6,
          strokeOpacity: 0.8,
          showDir: true,
          isOutline: true,
          outlineColor: "#fff",
        });

        // 确保地图实例仍然存在
        if (mapRef.current) {
          polylineRef.current.setMap(mapRef.current);
        } else {
          console.error("地图实例不存在，无法添加轨迹线");
          return;
        }

        // 添加标记点
        console.log("添加标记点");
        validActivities.forEach((activity, index) => {
          const marker = new window.AMap.Marker({
            position: [activity.longitude, activity.latitude] as [
              number,
              number
            ],
            title: `${activity.location_name} (${activity.first_year}年)`,
            label: {
              content: `${index + 1}. ${activity.location_name}`,
              direction: "top",
            },
            animation: "AMAP_ANIMATION_DROP",
          });

          // 确保地图实例仍然存在
          if (mapRef.current) {
            marker.setMap(mapRef.current);
            markersRef.current.push(marker);
          } else {
            console.error("地图实例不存在，无法添加标记点");
            return;
          }
        });

        // 调整地图视野
        console.log("调整地图视野");
        if (mapRef.current) {
          mapRef.current.setFitView();
        } else {
          console.error("地图实例不存在，无法调整视野");
        }
      } catch (err) {
        console.error("添加标记点和轨迹线错误:", err);
        messageApi.error("添加地图标记失败");
      }
    }
  }, [activities, mapLoading]);

  // 准备时间线数据（只显示有坐标的活动）
  const timelineItems = activities
    .filter((activity) => activity.longitude && activity.latitude)
    .sort((a, b) => a.first_year - b.first_year)
    .map((activity, index) => ({
      color: activity.relation_type === "任职地点" ? "blue" : "green",
      children: (
        <Card size="small" style={{ width: 300 }}>
          <p>
            <strong>地点：</strong>
            {activity.location_name}
          </p>
          <p>
            <strong>类型：</strong>
            {activity.relation_type}
          </p>
          <p>
            <strong>时间：</strong>
            {activity.first_year} - {activity.last_year}
          </p>
        </Card>
      ),
    }));

  console.log("当前状态:", {
    loading,
    mapLoading,
    error,
    activitiesCount: activities.length,
    person: person?.basic_info?.name_chn,
    timelineItemsCount: timelineItems.length,
  });

  if (loading || mapLoading) {
    console.log("显示加载状态");
    return (
      <Layout style={{ minHeight: "100vh" }}>
        <Content
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Spin size="large" />
        </Content>
      </Layout>
    );
  }

  if (error) {
    console.log("显示错误状态:", error);
    return (
      <Layout style={{ minHeight: "100vh", padding: "24px" }}>
        <Content>
          <Title level={2}>错误</Title>
          <p>{error}</p>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
            返回
          </Button>
        </Content>
      </Layout>
    );
  }

  if (!person) {
    console.log("未找到人物信息");
    return (
      <Layout style={{ minHeight: "100vh", padding: "24px" }}>
        <Content>
          <Title level={2}>未找到人物信息</Title>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
            返回
          </Button>
        </Content>
      </Layout>
    );
  }

  console.log("渲染主界面");
  return (
    <>
      {contextHolder}
      <Layout style={{ minHeight: "100vh" }}>
        <Content style={{ padding: "24px" }}>
          <div style={{ marginBottom: "16px" }}>
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
              返回
            </Button>
          </div>
          <Card>
            <Title level={3}>
              {person?.basic_info?.name_chn || "未知"} 的活动轨迹
            </Title>
            <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
              <div style={{ flex: 1, height: "600px", position: "relative" }}>
                <div
                  ref={mapContainerRef}
                  style={{
                    height: "100%",
                    width: "100%",
                    position: "absolute",
                  }}
                />
              </div>
              <div style={{ width: "400px" }}>
                <Timeline mode="left" items={timelineItems} />
              </div>
            </div>
          </Card>
        </Content>
      </Layout>
    </>
  );
};
