import React, { useState } from "react";
import { Table, Button, Form, Container, Card, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import donnees from "../../../data/data.json";
import "../possession.css";
import { Link } from 'react-router-dom'; 

function PossessionsTable({ possessions, currentDate, onEdit, onClose }) {
  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>Libelle</th>
          <th>Valeur Initiale</th>
          <th>Date de Début</th>
          <th>Date de Fin</th>
          <th>Amortissement</th>
          <th>Valeur Actuelle</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {possessions.map((possession, index) => {
          const diffYears =
            (new Date(currentDate) - new Date(possession.dateDebut)) /
            (1000 * 60 * 60 * 24 * 365);
          const valeurActuelle = possession.valeur
            ? possession.valeur -
              ((possession.valeur * (possession.tauxAmortissement || 0)) /
                100) *
                diffYears
            : 0;

          return (
            <tr key={index}>
              <td>{possession.libelle || "Inconnu"}</td>
              <td>{possession.valeur ? possession.valeur.toFixed(2) : "0.00"}</td>
              <td>{new Date(possession.dateDebut).toLocaleDateString()}</td>
              <td>{new Date(possession.dateFin).toLocaleDateString()}</td>
              <td>{possession.tauxAmortissement || "N/A"}%</td>
              <td>{valeurActuelle > 0 ? valeurActuelle.toFixed(2) : "0.00"}</td>
              <td>
                <Button variant="warning" onClick={() => onEdit(possession)}>Modifier</Button>
                <Button variant="danger" onClick={() => onClose(possession)}>Clôturer</Button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
}

function PossessionPage() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [possessions, setPossessions] = useState([...donnees].filter((el) => el.model === "Patrimoine").flatMap((el) => el.data.possessions));
  const [newPossession, setNewPossession] = useState({ libelle: '', valeur: '', tauxAmortissement: '' });

  const handleEdit = (possession) => {
    const updatedPossessions = possessions.map(p => p.libelle === 'Redmi Note 9' ? { ...p, libelle: 'Redmi Note 9 (Lost)' } : p);
    setPossessions(updatedPossessions);
  };
  
  const handleClose = (possession) => {
    const updatedPossessions = possessions.filter(p => p.libelle !== 'Redmi Note 9');
    setPossessions(updatedPossessions);
  };

  const handleAdd = () => {
    setPossessions([...possessions, { ...newPossession, libelle: 'Samsung Galaxy S23 (Gifted)', valeur: 1600000, tauxAmortissement: 10 }]);
    setNewPossession({ libelle: '', valeur: '', tauxAmortissement: '' });
  };

  const calculatePatrimoine = () => {
    let totalValue = 0;
    possessions.forEach((possession) => {
      const diffYears =
        (new Date(selectedDate) - new Date(possession.dateDebut)) /
        (1000 * 60 * 60 * 24 * 365);
      const valeurActuelle = possession.valeur
        ? possession.valeur -
          ((possession.valeur * (possession.tauxAmortissement || 0)) / 100) *
            diffYears
        : 0;

      if (valeurActuelle > 0) totalValue += valeurActuelle;
    });
  };

  return (
    <Container className="my-4">
      <h2 className="text-center">Possessions</h2>
      <Card className="shadow-sm">
        <Card.Body>
          <PossessionsTable
            possessions={possessions}
            currentDate={selectedDate}
            onEdit={handleEdit}
            onClose={handleClose}
          />
          <Row className="my-4">
            <Col md={6}>
              <Form.Group controlId="formDate">
                <Form.Label>Date</Form.Label>
                <Form.Control
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={6} className="text-end">
              <Button id="calculate-btn" onClick={calculatePatrimoine}>
                Calculer Valeur Patrimoine
              </Button>
              <Button id="reset-btn" onClick={() => setNewPossession({ libelle: '', valeur: '', tauxAmortissement: '' })}>
                Réinitialiser
              </Button>
            </Col>
          </Row>
          <Row className="my-4">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Libellé</Form.Label>
                <Form.Control
                  type="text"
                  value={newPossession.libelle}
                  onChange={(e) => setNewPossession({ ...newPossession, libelle: e.target.value })}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Valeur</Form.Label>
                <Form.Control
                  type="number"
                  value={newPossession.valeur}
                  onChange={(e) => setNewPossession({ ...newPossession, valeur: e.target.value })}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Taux d'Amortissement</Form.Label>
                <Form.Control
                  type="number"
                  value={newPossession.tauxAmortissement}
                  onChange={(e) => setNewPossession({ ...newPossession, tauxAmortissement: e.target.value })}
                />
              </Form.Group>
              <Button onClick={handleAdd}>Ajouter</Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
    
  );


}

export default PossessionPage;
