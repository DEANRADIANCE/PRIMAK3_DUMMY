import React from "react";
import { Form, Input, Button, Card, Typography, Space, Divider, Row, Col, Alert } from "antd";
import {
  UserOutlined,
  LockOutlined,
  SafetyCertificateOutlined,
  LoginOutlined,
} from "@ant-design/icons";
import { useLogin } from "@refinedev/core";
import { initialUsers } from "../../mocks/users";

const { Title, Text, Paragraph } = Typography;

export const LoginPage: React.FC = () => {
  const { mutate: login, isPending: isLoading } = useLogin();

  const handleFormSubmit = (values: any) => {
    login({ email: values.email, password: values.password });
  };

  const handleQuickLogin = (email: string) => {
    login({ email, password: "password123" });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f0f2f5",
        padding: "24px 16px",
      }}
    >
      <Card
        style={{
          width: "100%",
          maxWidth: 480,
          borderRadius: 16,
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
          border: "1px solid #e8e8e8",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 12,
              backgroundColor: "#595959",
              color: "#fff",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 26,
              fontWeight: 700,
              marginBottom: 12,
            }}
          >
            K3
          </div>
          <Title level={3} style={{ margin: 0, fontWeight: 700, color: "#262626" }}>
            PRIMA K3
          </Title>
          <Text type="secondary" style={{ fontSize: 14 }}>
            Sistem Informasi Keselamatan & Kesehatan Kerja
          </Text>
          <div style={{ fontSize: 13, color: "#8c8c8c", marginTop: 2 }}>
            Klinik Pratama ANRI (Arsip Nasional RI)
          </div>
        </div>

        <Form layout="vertical" onFinish={handleFormSubmit} initialValues={{ email: "admin@anri.go.id" }}>
          <Form.Item
            label="Alamat Email / NIP"
            name="email"
            rules={[{ required: true, message: "Silakan masukkan email atau NIP!" }]}
          >
            <Input
              prefix={<UserOutlined style={{ color: "#bfbfbf" }} />}
              placeholder="contoh: admin@anri.go.id"
              size="large"
            />
          </Form.Item>

          <Form.Item
            label="Kata Sandi"
            name="password"
            rules={[{ required: true, message: "Silakan masukkan kata sandi!" }]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: "#bfbfbf" }} />}
              placeholder="••••••••"
              size="large"
            />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            loading={isLoading}
            icon={<LoginOutlined />}
            style={{
              backgroundColor: "#595959",
              borderColor: "#595959",
              height: 44,
              fontSize: 15,
              fontWeight: 600,
            }}
          >
            Masuk ke Sistem
          </Button>
        </Form>

        <Divider plain style={{ margin: "24px 0 16px" }}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            AKUN DEMO PERAN (KLIK CEPAT)
          </Text>
        </Divider>

        <Row gutter={[8, 8]}>
          {initialUsers.map((u) => (
            <Col span={12} key={u.id}>
              <Button
                block
                size="middle"
                onClick={() => handleQuickLogin(u.email)}
                style={{
                  textAlign: "left",
                  height: "auto",
                  padding: "8px 12px",
                  borderRadius: 8,
                }}
              >
                <div style={{ fontWeight: 600, fontSize: 13, textTransform: "capitalize" }}>
                  {u.role.replace("_", " ")}
                </div>
                <div style={{ fontSize: 11, color: "#8c8c8c" }}>{u.email}</div>
              </Button>
            </Col>
          ))}
        </Row>
      </Card>
    </div>
  );
};
