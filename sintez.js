export { encodeWAV, evaluate, generatePCM, run, tokenize, typeify };
<<<<<<< HEAD

const amplitude = 32767;
const sampleRate = 44100;

=======
>>>>>>> 40207f2 (:construction: setting up for playing loops)

const AMPLITUDE = 32767;
const SAMPLE_RATE = 44100;

// sample[n]= A ⋅ sin(2 * π * f * (n / R)​)

// Where:
//   A: Amplitude (max value based on bit depth, e.g., 32767 for 16-bit)
//   f: Frequency (Hz), e.g., middle C = 261.63 Hz
//   R: Sample rate (samples per second), typically 44100 Hz
//   n: Sample number (integer), from 0 to R × duration − 1

<<<<<<< HEAD
function generatePCM(frequency, duration) {
  function fadeInPart(frequency, fadeSamples) {
=======
function generatePCM(frequency, duration, offset = 0) {
  const totalSamples = Math.floor(SAMPLE_RATE * (duration / 1000));
  const fadeSamples = Math.floor(SAMPLE_RATE * 0.01); // 10ms fade
  const sustainSamples = totalSamples - 2 * fadeSamples;

  const generateAttack = (frequency, fadeSamples, offset) => {
>>>>>>> 40207f2 (:construction: setting up for playing loops)
    const samples = [];
    for (let i = 0; i < fadeSamples; i++) {
      const t = i / sampleRate;
      const volume = i / fadeSamples;
      const sample = amplitude * volume * Math.sin(2 * Math.PI * frequency * t);
      samples.push(sample);
    }
    return samples;
  };

<<<<<<< HEAD
  function sustainPart(frequency, sustainSamples, startIndex) {
=======
  const generateSustain = (frequency, numSamples, offset) => {
>>>>>>> 40207f2 (:construction: setting up for playing loops)
    const samples = [];
    for (let i = 0; i < sustainSamples; i++) {
      const t = (startIndex + i) / sampleRate;
      const sample = amplitude * Math.sin(2 * Math.PI * frequency * t);
      samples.push(sample);
    }
    return samples;
  };

<<<<<<< HEAD
  function fadeOutPart(frequency, fadeSamples, startIndex) {
=======
  const generateDecay = (frequency, fadeSamples, offset) => {
>>>>>>> 40207f2 (:construction: setting up for playing loops)
    const samples = [];
    for (let i = 0; i < fadeSamples; i++) {
      const t = (startIndex + i) / sampleRate;
      const volume = (fadeSamples - i) / fadeSamples;
      const sample = amplitude * volume * Math.sin(2 * Math.PI * frequency * t);
      samples.push(sample);
    }
    return samples;
<<<<<<< HEAD
  }

  const totalSamples = Math.floor(sampleRate * (duration / 1000));
  const fadeSamples = Math.floor(totalSamples / 10);
  const sustainSamples = totalSamples - fadeSamples * 2;
=======
  };
>>>>>>> 40207f2 (:construction: setting up for playing loops)

  const fadeIn = fadeInPart(frequency, fadeSamples);
  const sustain = sustainPart(frequency, sustainSamples, fadeSamples);
  const fadeOut = fadeOutPart(
    frequency,
    fadeSamples,
    fadeSamples + sustainSamples,
  );

  return [...fadeIn, ...sustain, ...fadeOut];
}

function sequence(...PCMs) {
  const totalSamples = PCMs.reduce((acc, pcm) => acc + pcm.length, 0);
  const combinedSamples = new Int16Array(totalSamples);

  PCMs.reduce((offset, pcm) => {
    combinedSamples.set(pcm, offset);
    return offset + pcm.length;
  }, 0);

  return combinedSamples;
}

function parallel(...PCMs) {
  const maxLength = Math.max(...PCMs.map((pcm) => pcm.length));
  const combinedSamples = new Int16Array(maxLength);
  const numPCMs = PCMs.length;
  for (let i = 0; i < maxLength; i++) {
    const samplesAtI = PCMs.map((pcm) => pcm[i] || 0);
    const averageSample = samplesAtI.reduce((acc, sample) => acc + sample, 0) /
      numPCMs;
    combinedSamples[i] = averageSample;
  }
  return combinedSamples;
}

async function encodeWAV(
  samples,
  output = "output.wav",
  sampleRate = 44100,
) {
  const headerSize = 44;
  const dataSize = samples.length * 2;
  const buffer = new ArrayBuffer(headerSize + dataSize);
  const view = new DataView(buffer);

  const writeString = (offset, str) => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  };

  writeString(0, "RIFF");
  view.setUint32(4, 36 + dataSize, true);
  writeString(8, "WAVE");
  writeString(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 2, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 4, true);
  view.setUint16(32, 4, true);
  view.setUint16(34, 16, true);
  writeString(36, "data");
  view.setUint32(40, dataSize, true);

  for (let i = 0; i < samples.length; i++) {
    view.setInt16(headerSize + i * 2, samples[i], true);
  }

  await Deno.writeFile(
    output,
    new Uint8Array(buffer),
  );
}

const typeify = (token) => {
  if (!isNaN(token)) return parseFloat(token);
  return atom(token);
};

const atom = (name) => Symbol.for(name);


const tokenize = (input) => {
  if (input.trim() === "") return [];
  const loop = (
    stack,
    [char, ...rest],
    token = "",
  ) => {
    if (char === undefined) {
      if (token) stack[stack.length - 1].push(typeify(token));
      return stack[0];
    }

    if (char === "(") {
      const newList = [];
      stack[stack.length - 1].push(newList);
      stack.push(newList);
      return loop(stack, rest, "");
    }

    if (char === ")") {
      if (token) stack[stack.length - 1].push(typeify(token));
      stack.pop();
      return loop(stack, rest, "");
    }

    if (char === " " || char === "\n" || char === "\t") {
      if (token) stack[stack.length - 1].push(typeify(token));
      return loop(stack, rest, "");
    }

    return loop(stack, rest, token + char);
  };

  return loop([[]], [...input]);
};

const evaluate = (expression) => {
  if (typeof expression === "number") return expression;

  if (Array.isArray(expression)) {
    const [head, ...rest] = expression;

    if (head === atom("tone")) {
      const [freq, dur] = rest;
      return generatePCM(freq, dur);
    }

    if (head === atom("sequence")) {
      const sequences = rest.map(evaluate);
      return sequences.flat();
    }

    if (head === atom("parallel")) {
      const parts = rest.map(evaluate);
      const maxLength = Math.max(...parts.map((p) => p.length));
      const output = new Array(maxLength).fill(0);

      for (const part of parts) {
        for (let i = 0; i < part.length; i++) {
          output[i] += part[i];
        }
      }

      return output.map((s) => s / parts.length);
    }

    if (head === atom("repeat")) {
      const [count, expr] = rest;
      const evaluated = evaluate(expr);
      let output = [];
      for (let i = 0; i < count; i++) {
        output = output.concat(evaluated);
      }
      return output;
    }

    throw new Error("Unknown command: " + head.toString());
  }
};

const run = (input) => {
  const tokens = tokenize(input);
  const expression = tokens[0];
  return evaluate(expression);
};
