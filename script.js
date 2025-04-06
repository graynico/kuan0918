body {
  font-family: 'Arial', sans-serif;
  background-color: #f6f8fa;
  margin: 0;
  padding: 0;
}

.container {
  max-width: 500px;
  margin: 0 auto;
  padding: 1rem;
}

h1 {
  text-align: center;
  font-size: 1.8rem;
}

hr {
  margin-bottom: 1rem;
}

.area-block {
  background: #ffffff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  position: relative;
}

.area-block h4 {
  margin-top: 0;
}

.input-fields,
.area-row {
  margin-bottom: 0.5rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.input-fields input,
.quantity {
  width: 100px;
  padding: 0.3rem;
  font-size: 1rem;
}

.shape-select {
  width: 100%;
  margin: 0.5rem 0;
  padding: 0.4rem;
  font-size: 1rem;
}

.area-row p {
  margin: 0;
  font-size: 0.9rem;
  flex: 1 1 45%;
}

.buttons {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

button {
  padding: 0.5rem 1rem;
  font-size: 1rem;
  cursor: pointer;
  border: none;
  border-radius: 6px;
  background-color: #007bff;
  color: white;
}

button:hover {
  background-color: #0056b3;
}

.delete-area {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: transparent;
  border: none;
  font-size: 1.2rem;
  color: red;
  cursor: pointer;
}

#total-area,
#formula {
  text-align: center;
  margin-bottom: 0.5rem;
  font-weight: bold;
  font-size: 1rem;
}

@media (max-width: 480px) {
  .input-fields input,
  .quantity {
    width: 100%;
  }

  .area-row {
    flex-direction: column;
  }
}
