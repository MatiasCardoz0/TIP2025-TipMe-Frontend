import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import HomeScreen from "../app/home";

describe("Modal de creación de mesa", () => {
  it("si los campos no estan completos se deshabilita el botón Confirmar", () => {
    const { getByPlaceholderText, getByText } = render(<HomeScreen />);
    fireEvent.press(getByText("╋ Agregar Mesa"));

    // traigo los elementos del modal
    const nombre = getByPlaceholderText("Nombre de la mesa");
    const numero = getByPlaceholderText("Numero de mesa");
    const confirmarBtn = getByText("Confirmar");

    // solo el campo de 'nombre' completo
    fireEvent.changeText(nombre, "Mesa 1");
    expect(confirmarBtn.props.accessibilityState.disabled).toBe(true);

    // solo el campo de 'numero' completo
    fireEvent.changeText(nombre, "");
    fireEvent.changeText(numero, "5");
    expect(confirmarBtn.props.accessibilityState.disabled).toBe(true);

    //todos los campos completos, y el numero es un entero
    fireEvent.changeText(nombre, "Mesa 1");
    fireEvent.changeText(numero, "5");
    expect(confirmarBtn.props.accessibilityState.disabled).toBe(false);

    //todos los campos completos, pero el numero no es un entero
    fireEvent.changeText(nombre, "Mesa 1");
    fireEvent.changeText(numero, "5.5");
    expect(confirmarBtn.props.accessibilityState.disabled).toBe(true);
  });
});