DEPS = ./public/src/cpp/processor-perf.cpp

# OUTPUT_JS = ./public/src/js/worklet/CompiledProcessorModule.js
OUTPUT_WASM = ./public/src/js/worklet/ProcessWasm.wasm

CC = emcc

# EM_ES6_PATH = ./public/lib/em-es6-module.js

FLAGS = --no-entry \
    -s WASM=1 \
    -s EXPORTED_FUNCTIONS=_processPerf \
    -s ALLOW_MEMORY_GROWTH=1 \
    -o $(OUTPUT_WASM) $(DEPS) \

build: $(DEPS)
	@$(CC) $(FLAGS)

clean:
	@rm -rf $(OUTPUT_WASM)
