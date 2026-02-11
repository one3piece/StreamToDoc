// Since we cannot actually download YouTube videos in a browser-only environment (CORS/Backend required),
// we will use this mock transcript to simulate the "downloaded" content for the Gemini API to process.
// This ensures the AI features actually work for the demo.

export const MOCK_TRANSCRIPT = `
[00:00.000] Welcome everyone. Today we are going to dive deep into the architecture of Transformers, specifically focusing on why they revolutionized Natural Language Processing.
[00:15.500] Before Transformers, we relied heavily on Recurrent Neural Networks or RNNs. The problem with RNNs was sequential processing. You couldn't parallelize the training.
[00:45.200] In 2017, the paper "Attention is All You Need" introduced the Transformer. The core idea is the Self-Attention mechanism.
[01:10.000] Let's break down Self-Attention. Imagine reading a sentence: "The animal didn't cross the street because it was too tired." When the model processes "it", how does it know "it" refers to the animal and not the street?
[02:00.000] Attention scores allow the model to weigh the relevance of every other word in the sentence to the current word being processed.
[03:20.000] The architecture consists of an Encoder and a Decoder. The Encoder maps an input sequence to a sequence of continuous representations. The Decoder then generates an output sequence.
[04:45.000] Another key component is Multi-Head Attention. Instead of performing a single attention function, we project the queries, keys, and values h times with different, learned linear projections.
[06:10.000] This allows the model to jointly attend to information from different representation subspaces at different positions.
[07:30.000] Finally, let's talk about Positional Encoding. Since the Transformer contains no recurrence and no convolution, we must inject some information about the relative or absolute position of the tokens in the sequence.
[08:50.000] In summary, Transformers enable parallelization, capture long-range dependencies better than RNNs, and scale incredibly well with data and compute.
`;

export const MOCK_VIDEO_META = {
  title: "Transformer Neural Networks Explained",
  thumbnail: "https://picsum.photos/seed/transformer/800/450",
  duration: "10:05",
};
