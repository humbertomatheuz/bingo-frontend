<template>
    <div class="container">
      <h1>Bem-vindo ao Bingo!</h1>
      <p>Escolha seu papel:</p>
      <button @click="$router.push('/sorteador')">Mestre da Sala</button>
      <button @click="$router.push('/cartela')">Jogador</button>
    </div>
  </template>
  
  <style scoped>
  .container {
    background-color: #2c003e;
    color: white;
    text-align: center;
    padding: 20px;
    border-radius: 10px;
    width: 50%;
    margin: auto;
    margin-top: 50px;
    box-shadow: 0px 0px 10px rgba(255, 255, 255, 0.2);
  }
  button {
    background-color: #bb86fc;
    color: white;
    border: none;
    padding: 10px;
    margin: 10px;
    cursor: pointer;
    font-size: 16px;
    border-radius: 5px;
  }
  </style>
  