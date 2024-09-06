import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import { Container, Row, Col, Button, Form, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function PatrimoinePage() {
  const [dateDebut, setDateDebut] = useState(new Date());
  const [dateFin, setDateFin] = useState(new Date());
  const [jour, setJour] = useState('1');
  const [chartData, setChartData] = useState(null);
  const [patrimoineValue, setPatrimoineValue] = useState(0);

  const fetchValeurPatrimoine = async () => {
    try {
      const response = await axios.post('/patrimoine/range', {
        type: 'month',
        dateDebut: dateDebut.toISOString().split('T')[0],
        dateFin: dateFin.toISOString().split('T')[0],
        jour: parseInt(jour, 10),
      });

      setPatrimoineValue(response.data.value);
      setChartData({
        labels: response.data.labels,
        datasets: [
          {
            label: 'Valeur du Patrimoine',
            data: response.data.values,
            borderColor: '#007bff',
            backgroundColor: 'rgba(0, 123, 255, 0.2)',
            fill: true,
          }
        ]
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des données', error);
    }
  };

  return (
    <Container className="my-4">
      <h2 className="text-center mb-4" style={styles.title}>Patrimoine</h2>
      <Card className="shadow-sm" style={styles.card}>
        <Card.Body>
          <Row>
            <Col md={6}>
              <Form.Group>
                <Form.Label style={styles.label}>Date de Début</Form.Label>
                <DatePicker
                  selected={dateDebut}
                  onChange={date => setDateDebut(date)}
                  dateFormat="yyyy/MM/dd"
                  className="form-control"
                  style={styles.datePicker}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label style={styles.label}>Date de Fin</Form.Label>
                <DatePicker
                  selected={dateFin}
                  onChange={date => setDateFin(date)}
                  dateFormat="yyyy/MM/dd"
                  className="form-control"
                />
              </Form.Group>
            </Col>
          </Row>
          <Row className="my-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label style={styles.label}>Jour</Form.Label>
                <Form.Control
                  as="select"
                  value={jour}
                  onChange={e => setJour(e.target.value)}
                  style={styles.select}
                >
                  <option value="1">Jour 1</option>
                  <option value="2">Jour 2</option>
                </Form.Control>
              </Form.Group>
            </Col>
            <Col md={6} className="text-end">
              <Button
                onClick={fetchValeurPatrimoine}
                style={styles.button}
                className="shadow-sm"
              >
                Valider
              </Button>
            </Col>
          </Row>
          <h3 className="text-center mt-4" style={styles.valueText}>
            Valeur du Patrimoine = {patrimoineValue} Ar
          </h3>
          <div className="mt-4">
            {chartData ? (
              <Line data={chartData} />
            ) : (
              <p className="text-center">Aucune donnée à afficher</p>
            )}
          </div>
          <Row className="my-4">
            <Col className="text-center">
              <Link to="/possessions">
                <Button style={styles.button} className="shadow-sm">
                  Voir Possessions
                </Button>
              </Link>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
}

const styles = {
  card: {
    backgroundColor: '#f9f9f9',
    borderRadius: '12px',
    padding: '20px',
    borderColor: '#dddddd',
    borderWidth: '1px',
    borderStyle: 'solid',
  },
  title: {
    fontWeight: 'bold',
    color: '#343a40',
  },
  label: {
    fontWeight: '600',
    color: '#495057',
  },
  button: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
    color: '#ffffff',
    padding: '10px 20px',
    borderRadius: '5px',
    transition: 'background-color 0.3s',
  },
  buttonHover: {
    backgroundColor: '#0056b3',
  },
  valueText: {
    color: '#17a2b8',
  },
  datePicker: {
    width: '100%',
    padding: '10px',
    borderRadius: '5px',
  },
  select: {
    padding: '10px',
    borderRadius: '5px',
    width: '100%',
  },
};

export default PatrimoinePage;
