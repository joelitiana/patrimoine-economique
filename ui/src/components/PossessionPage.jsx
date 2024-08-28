import React, { useState, useRef } from "react";
import {
  Table,
  Button,
  Form,
  Container,
  Card,
  Row,
  Col,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import donnees from "../../../data/data.json";
import "../possession.css";

function PossessionsTable({ possessions, currentDate }) {
  console.log(possessions);
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
              <td>
                {possession.valeur ? possession.valeur.toFixed(2) : "0.00"}
              </td>
              <td>{new Date(possession.dateDebut).toLocaleDateString()}</td>
              <td>{new Date(possession.dateFin).toLocaleDateString()}</td>
              <td>{possession.tauxAmortissement || "N/A"}%</td>
              <td>{valeurActuelle > 0 ? valeurActuelle.toFixed(2) : "0.00"}</td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
}

function PatrimoinePage() {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [patrimoineValue, setPatrimoineValue] = useState(0);
  const dateInputRef = useRef();

  const patrimoines = [...donnees].filter((el) => el.model === "Patrimoine");
  const possessions = patrimoines.map((el) => el.data.possessions).flat();

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
    setPatrimoineValue(totalValue.toFixed(2));
  };

  const resetPatrimoine = () => {
    setPatrimoineValue(0);
    setSelectedDate(new Date().toISOString().split("T")[0]);
  };

  return (
    <div className="table-container">
      <Container className="my-4">
        <h2 className="text-center">Possession</h2>
        <Card className="shadow-sm">
          <Card.Body>
            <PossessionsTable
              possessions={possessions}
              currentDate={selectedDate}
            />
          </Card.Body>
        </Card>
        <Row className="my-4">
          <Col md={6}>
            <Form.Group controlId="formDate">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                ref={dateInputRef}
                value={selectedDate}
                onChange={() => setSelectedDate(dateInputRef.current.value)}
              />
            </Form.Group>
          </Col>
          <Col md={6} className="text-end">
            <Button id="calculate-btn" onClick={calculatePatrimoine}>
              Calculer Valeur Patrimoine
            </Button>
            <Button id="reset-btn" onClick={resetPatrimoine}>
              Reinitialiser
            </Button>
          </Col>
        </Row>
        <h3 className="text-center">
          Valeur du Patrimoine = {patrimoineValue} Ar{" "}
        </h3>
      </Container>
    </div>
  );
}

export default PatrimoinePage;