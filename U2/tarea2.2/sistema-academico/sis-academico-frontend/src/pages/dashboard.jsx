import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Container } from 'react-bootstrap';

const Dashboard = () => {
  const rol = localStorage.getItem('rol');
  const [stats, setStats] = useState({ estudiantes: 0, docentes: 0, asignaturas: 0 });

  useEffect(() => {
    if (rol === 'admin') {
      fetch('http://localhost:3000/api/admin/stats', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })
        .then(res => res.json())
        .then(data => setStats(data))
        .catch(err => console.error(err));
    }
  }, [rol]);

  const StatCard = ({ title, count, icon, color, bg }) => (
    <Card className="text-white h-100 shadow-sm border-0" style={{ background: bg, borderRadius: '15px' }}>
      <Card.Body className="d-flex align-items-center justify-content-between">
        <div>
          <h6 className="text-uppercase mb-2 opacity-75" style={{ fontSize: '0.9rem', letterSpacing: '1px' }}>{title}</h6>
          <h2 className="display-4 fw-bold mb-0">{count}</h2>
        </div>
        <div className="bg-white bg-opacity-25 rounded-circle p-3 d-flex align-items-center justify-content-center" style={{ width: '70px', height: '70px' }}>
          <i className={`bi ${icon}`} style={{ fontSize: '2rem', color: '#fff' }}></i>
        </div>
      </Card.Body>
    </Card>
  );

  return (
    <Container fluid className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-dark">Panel de Control</h2>
          <p className="text-muted">Bienvenido de nuevo, <strong>{rol ? rol.toUpperCase() : ''}</strong></p>
        </div>
        <div className="text-end">
          <small className="text-muted">{new Date().toLocaleDateString()}</small>
        </div>
      </div>

      {rol === 'admin' && (
        <Row className="g-4">
          <Col md={4}>
            <StatCard
              title="Estudiantes"
              count={stats.estudiantes}
              icon="bi-people-fill"
              bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
            />
          </Col>
          <Col md={4}>
            <StatCard
              title="Docentes"
              count={stats.docentes}
              icon="bi-person-badge-fill"
              bg="linear-gradient(135deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)"
            />
          </Col>
          <Col md={4}>
            <StatCard
              title="Asignaturas"
              count={stats.asignaturas}
              icon="bi-book-fill"
              bg="linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)"
            />
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default Dashboard;
