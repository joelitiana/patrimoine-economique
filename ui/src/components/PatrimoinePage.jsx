import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import { Container, Row, Col, Button, Form, Card } from 'react-bootstrap';

function PatrimoinePage() {
  const [dateDebut, setDateDebut] = useState(new Date());
  const [dateFin, setDateFin] = useState(new Date());
  const [jour, setJour] = useState('1');
  const [chartData, setChartData] = useState({});
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
          }
        ]
      });
    } catch (error) {
      console.log('Erreur lors de la récupération des données', error);
    }
  };

  return (
    <Container className="my-4">
      <h2 className="text-center">Patrimoine</h2>
      <Card className="shadow-sm">
        <Card.Body>
          <Row>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Date de Début</Form.Label>
                <DatePicker
                  selected={dateDebut}
                  onChange={date => setDateDebut(date)}
                  dateFormat="yyyy/MM/dd"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Date de Fin</Form.Label>
                <DatePicker
                  selected={dateFin}
                  onChange={date => setDateFin(date)}
                  dateFormat="yyyy/MM/dd"
                />
              </Form.Group>
            </Col>
          </Row>
          <Row className="my-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Jour</Form.Label>
                <Form.Control
                  as="select"
                  value={jour}
                  onChange={e => setJour(e.target.value)}
                >
                  <option value="1">Jour 1</option>
                  <option value="2">Jour 2</option>
                </Form.Control>
              </Form.Group>
            </Col>
            <Col md={6} className="text-end">
              <Button onClick={fetchValeurPatrimoine}>Valider</Button>
            </Col>
          </Row>
          <h3 className="text-center">
            Valeur du Patrimoine = {patrimoineValue} Ar
          </h3>
          <div>
            <Line data={chartData} />
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default PatrimoinePage;
