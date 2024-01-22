import { BigDecimal } from 'bigdecimal';

function calcularInteresCompuesto(
  _capitalInicial: string,
  _aportacionAnual: string,
  _tasaInteres: string,
  _periodo: number
): void {
  const capitalInicialDecimal = new BigDecimal(_capitalInicial);
  const aportacionAnualDecimal = new BigDecimal(_aportacionAnual);

  let tasaInteresDecimal = new BigDecimal(_tasaInteres).divide(
    new BigDecimal('100')
  );

  let capitalActualTotalDecimal = capitalInicialDecimal;
  let aportacionesTotalDecimal = new BigDecimal('0');

  let incrementoAnual: {
    total: BigDecimal;
    capitalInicial: BigDecimal;
    aportacion: BigDecimal;
    intereses: BigDecimal;
  }[] = [];

  for (let ano = 1; ano <= _periodo; ano++) {
    aportacionesTotalDecimal = aportacionesTotalDecimal.add(
      aportacionAnualDecimal
    );

    let interesAnual = capitalActualTotalDecimal.multiply(tasaInteresDecimal);

    capitalActualTotalDecimal = capitalActualTotalDecimal
      .add(interesAnual)
      .add(aportacionAnualDecimal);

    incrementoAnual.push({
      total: capitalActualTotalDecimal.setScale(2, BigDecimal.ROUND_HALF_UP),
      capitalInicial: capitalInicialDecimal.setScale(
        2,
        BigDecimal.ROUND_HALF_UP
      ),
      aportacion: aportacionesTotalDecimal.setScale(
        2,
        BigDecimal.ROUND_HALF_UP
      ),
      intereses: capitalActualTotalDecimal
        .subtract(capitalInicialDecimal)
        .subtract(aportacionesTotalDecimal)
        .setScale(2, BigDecimal.ROUND_HALF_UP),
    });
  }

  console.log(
    `Capital final después de ${_periodo} años: ${capitalActualTotalDecimal
      .setScale(2, BigDecimal.ROUND_HALF_UP)
      .toString()}`
  );
  console.log('Incremento Anual:');
  incrementoAnual.forEach((capital, index) => {
    console.log(`Año ${index + 1}`);
    console.log(`\tTotal: ${capital.total.toString()}`);
    console.log(`\tCapital Inicial: ${capital.capitalInicial.toString()}`);
    console.log(`\tAportaciones Total: ${capital.aportacion.toString()}`);
    console.log(`\tIntereses Total: ${capital.intereses.toString()}`);
  });
}

// Ejemplo de uso
let capitalInicial = '10000'; // Capital inicial
let aportacionAnual = '1000'; // Aportación anual
let tasaInteres = '5'; // Tasa de interés anual en porcentaje
let periodo = 10; // Periodo de inversión en años

calcularInteresCompuesto(capitalInicial, aportacionAnual, tasaInteres, periodo);
